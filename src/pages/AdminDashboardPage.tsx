import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Upload, X, AlertTriangle, Trash, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { newModelAssets, newSceneAssets, textureAssets, type AssetCardContent } from '../data/homeContent';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  createAsset,
  deleteAsset,
  listAssets,
  updateAsset,
  type Asset,
  type UpsertAssetPayload,
} from '../services/assetService';
import { ApiError } from '../services/apiClient';
import { clearTokens } from '../services/authService';

const formatDate = (value: string | undefined) => {
  if (!value) {
    return 'Unknown';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return 'Unknown';
  }

  const isoGuess = trimmed.includes('T') || trimmed.includes('-') ? trimmed : trimmed.split('.').reverse().join('-');
  const parsed = new Date(isoGuess);

  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
};

const resolveStatus = (asset: { status?: string; credits?: number | 'free'; visibility?: string }) => {
  if (asset.status) {
    const normalized = asset.status.toUpperCase();
    if (normalized === 'PUBLISHED') {
      return { label: 'Published', tone: 'emerald' as const };
    }
    if (normalized === 'DRAFT') {
      return { label: 'Draft', tone: 'amber' as const };
    }
  }

  if (asset.visibility && asset.visibility.toUpperCase() === 'PRIVATE') {
    return { label: 'Private', tone: 'blue' as const };
  }

  if (asset.credits === 'free') {
    return { label: 'Live', tone: 'emerald' as const };
  }

  if (typeof asset.credits === 'number') {
    if (asset.credits >= 8) {
      return { label: 'Scheduled', tone: 'blue' as const };
    }
    if (asset.credits >= 5) {
      return { label: 'Review', tone: 'amber' as const };
    }
    return { label: 'Active', tone: 'emerald' as const };
  }

  return { label: 'Draft', tone: 'amber' as const };
};

const statusToneClass: Record<'emerald' | 'blue' | 'amber', string> = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
};

const creditLabel = (credits: unknown) => {
  if (credits === 'free') {
    return 'Free';
  }
  if (typeof credits === 'number') {
    return `${credits} credits`;
  }
  return '—';
};

const typeLabelMap = {
  MODEL: 'Model',
  SCENE: 'Scene',
  TEXTURE: 'Texture',
  FEATURED: 'Featured',
} as const;

type AssetTypeKey = keyof typeof typeLabelMap;

type TableRow = {
  id: string;
  title: string;
  type: (typeof typeLabelMap)[AssetTypeKey];
  category: string;
  author: string;
  credits: string;
  views: number;
  likes: number;
  updatedAt: string;
  statusLabel: string;
  statusTone: 'emerald' | 'blue' | 'amber';
};

type TypeFilter = 'ALL' | 'MODEL' | 'SCENE' | 'TEXTURE' | 'FEATURED';
type StatusFilter = 'ALL' | 'PUBLISHED' | 'DRAFT' | 'PRIVATE';

const typeFilterOptions: Array<{ value: TypeFilter; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'MODEL', label: 'Models' },
  { value: 'SCENE', label: 'Scenes' },
  { value: 'TEXTURE', label: 'Textures' },
  { value: 'FEATURED', label: 'Featured' },
];

const statusFilterOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PRIVATE', label: 'Private' },
];

const sampleAssetPayload: UpsertAssetPayload = {
  type: 'MODEL',
  title: 'New Lounge Chair',
  subtitle: 'Furniture / Seating',
  author: 'Internal Library',
  category: 'Furniture',
  brand: 'Laruus Studio',
  description: 'Hero lounge chair model imported via admin JSON upload.',
  credits: 'free',
  size: 'small',
  aspectRatio: 'square',
  image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
  gallery: [
    'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  downloadOptions: [
    { label: 'Download 3D Model', size: '45 MB' },
  ],
  status: 'PUBLISHED',
  visibility: 'PUBLIC',
};

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const fallbackAssets = useMemo(() => {
    const withType = <T extends AssetCardContent>(items: T[], type: AssetTypeKey) =>
      items.map(item => ({ ...item, type }));

    return [
      ...withType(newModelAssets, 'MODEL'),
      ...withType(newSceneAssets, 'SCENE'),
      ...withType(textureAssets, 'TEXTURE'),
    ];
  }, []);

  const [remoteAssets, setRemoteAssets] = useState<Asset[]>([]);
  const [hasFetchedRemoteAssets, setHasFetchedRemoteAssets] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [assetPayload, setAssetPayload] = useState('');
  const [assetError, setAssetError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const filterContainerRef = useRef<HTMLDivElement | null>(null);

  const redirectToHome = useCallback(() => {
    clearTokens();
    window.localStorage.removeItem('user');
    navigate('/', { replace: true });
  }, [navigate]);

  useEffect(() => {
    let isCancelled = false;
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const items = await listAssets({ query: debouncedSearchValue || undefined });
        if (!isCancelled) {
          setRemoteAssets(items);
          setLoadError(null);
          setHasFetchedRemoteAssets(true);
        }
      } catch (error) {
        if (!isCancelled) {
          if (error instanceof ApiError && error.status === 401) {
            redirectToHome();
            return;
          }
          const message = error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : 'Failed to load assets.';
          setLoadError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAssets();
    return () => {
      isCancelled = true;
    };
  }, [debouncedSearchValue, redirectToHome]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, 350);

    return () => window.clearTimeout(handle);
  }, [searchValue]);

  useEffect(() => {
    if (!openRowMenuId) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && target.closest('[data-asset-menu-root]')) {
        return;
      }
      setOpenRowMenuId(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openRowMenuId]);

  useEffect(() => {
    if (!isFilterPanelOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (filterContainerRef.current && target && filterContainerRef.current.contains(target)) {
        return;
      }
      setIsFilterPanelOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterContainerRef, isFilterPanelOpen]);

  const hasRemoteAssets = remoteAssets.length > 0;
  const isSearchActive = Boolean(debouncedSearchValue);

  const dataSourceLabel = useMemo(() => {
    if (isSearchActive) {
      return hasFetchedRemoteAssets
        ? `search results for "${debouncedSearchValue}".`
        : 'search results.';
    }
    return hasFetchedRemoteAssets ? 'the live asset inventory.' : 'the storefront seed content.';
  }, [debouncedSearchValue, hasFetchedRemoteAssets, isSearchActive]);

  const rows = useMemo<TableRow[]>(() => {
    const shouldUseRemote = hasFetchedRemoteAssets || isSearchActive;
    const source = (shouldUseRemote ? remoteAssets : fallbackAssets) as Array<Asset | AssetCardContent>;
    const filteredSource = source.filter(item => {
      if (!shouldUseRemote && isSearchActive) {
        const term = debouncedSearchValue.toLowerCase();
        const haystacks: unknown[] = [
          'title' in item ? item.title : undefined,
          'subtitle' in item ? item.subtitle : undefined,
          'description' in item ? item.description : undefined,
          'category' in item ? item.category : undefined,
          'author' in item ? item.author : undefined,
        ];

        const matchesSearch = haystacks.some(value => typeof value === 'string' && value.toLowerCase().includes(term));
        if (!matchesSearch) {
          return false;
        }
      }

      const sourceType = (item as { type?: string }).type;
      const rawType = typeof sourceType === 'string' ? sourceType.trim().toUpperCase() : 'MODEL';
      if (typeFilter !== 'ALL' && rawType !== typeFilter) {
        return false;
      }

      const sourceStatus = (item as { status?: string }).status;
      const rawStatus = typeof sourceStatus === 'string' ? sourceStatus.trim().toUpperCase() : 'PUBLISHED';
      const normalizedStatus: StatusFilter = rawStatus === 'DRAFT' || rawStatus === 'PRIVATE' ? (rawStatus as StatusFilter) : 'PUBLISHED';
      if (statusFilter !== 'ALL' && normalizedStatus !== statusFilter) {
        return false;
      }

      const rawCredits = 'credits' in item ? (item as { credits?: number | 'free' }).credits : undefined;
      if (showOnlyFree && rawCredits !== 'free') {
        return false;
      }

      return true;
    });

    return filteredSource.map(asset => {
  const rawType = typeof asset.type === 'string' ? asset.type.trim().toUpperCase() : 'MODEL';
      const typeKey: AssetTypeKey = (typeLabelMap[rawType as AssetTypeKey] ? rawType : 'MODEL') as AssetTypeKey;
      const status = resolveStatus({
        status: 'status' in asset ? (asset as { status?: string }).status : undefined,
        credits: 'credits' in asset ? (asset as { credits?: number | 'free' }).credits : undefined,
        visibility: 'visibility' in asset ? (asset as { visibility?: string }).visibility : undefined,
      });
      const category = 'category' in asset && asset.category ? asset.category : 'Uncategorised';
      const author = 'author' in asset && asset.author ? asset.author : 'Unknown';
      const rawUpdatedAt =
        'updatedAt' in asset && typeof asset.updatedAt === 'string'
          ? asset.updatedAt
          : 'date' in asset && typeof asset.date === 'string'
            ? asset.date
            : undefined;
      const views = 'views' in asset && typeof asset.views === 'number' ? asset.views : 0;
      const likes = 'likes' in asset && typeof asset.likes === 'number' ? asset.likes : 0;

      return {
        id: 'id' in asset && typeof asset.id === 'string' ? asset.id : 'unknown-asset',
        title: 'title' in asset && asset.title ? asset.title : 'Untitled asset',
        type: typeLabelMap[typeKey],
        category,
        author,
        credits: creditLabel('credits' in asset ? (asset as { credits?: number | 'free' }).credits : undefined),
        views,
        likes,
        updatedAt: formatDate(rawUpdatedAt),
        statusLabel: status.label,
        statusTone: status.tone,
      };
    });
  }, [debouncedSearchValue, fallbackAssets, hasFetchedRemoteAssets, isSearchActive, remoteAssets, showOnlyFree, statusFilter, typeFilter]);

  const summary = useMemo(() => {
    const aggregated = rows.reduce(
      (acc, row) => {
        acc.total += 1;
        acc.totalViews += row.views;
        if (row.credits === 'Free') {
          acc.free += 1;
        }
        acc.byType[row.type] = (acc.byType[row.type] ?? 0) + 1;
        return acc;
      },
      {
        total: 0,
        free: 0,
        totalViews: 0,
        byType: {
          Model: 0,
          Scene: 0,
          Texture: 0,
          Featured: 0,
        } as Record<TableRow['type'], number>,
      },
    );

    const averageViews = aggregated.total > 0 ? Math.round(aggregated.totalViews / aggregated.total) : 0;

    return {
      ...aggregated,
      averageViews,
    };
  }, [rows]);

  const activeFilterCount = (statusFilter !== 'ALL' ? 1 : 0) + (showOnlyFree ? 1 : 0);
  const getTypeButtonClass = (value: TypeFilter) =>
    value === typeFilter
      ? 'rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white shadow-sm'
      : 'rounded-full px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100';

  const openCreateModal = () => {
    setModalMode('create');
    setEditingAssetId(null);
    setIsAssetModalOpen(true);
    setAssetPayload(JSON.stringify(sampleAssetPayload, null, 2));
    setAssetError(null);
    setSuccessMessage(null);
    setOpenRowMenuId(null);
  };

  const closeAssetModal = () => {
    setIsAssetModalOpen(false);
    setAssetError(null);
    setIsSubmitting(false);
    setEditingAssetId(null);
    setModalMode('create');
  };

  const handleEditAsset = (assetId: string) => {
    const asset = remoteAssets.find(item => item.id === assetId);
    if (!asset) {
      setOpenRowMenuId(null);
      setLoadError('Selected asset could not be found. Please refresh the page.');
      return;
    }

    setModalMode('edit');
    setEditingAssetId(assetId);
    setAssetPayload(JSON.stringify(asset, null, 2));
    setAssetError(null);
    setSuccessMessage(null);
    setIsAssetModalOpen(true);
    setOpenRowMenuId(null);
  };

  const confirmDeleteAsset = (assetId: string) => {
    const asset = remoteAssets.find(item => item.id === assetId);
    if (!asset) {
      setOpenRowMenuId(null);
      setLoadError('Selected asset could not be found. Please refresh the page.');
      return;
    }

    setOpenRowMenuId(null);
    setDeleteTarget(asset);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeletingId) {
      return;
    }
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const handleDeleteAsset = async () => {
    if (!deleteTarget) {
      setIsDeleteModalOpen(false);
      return;
    }

    const assetId = deleteTarget.id;
    setIsDeletingId(assetId);
    try {
      await deleteAsset(assetId);
      setRemoteAssets(prev => prev.filter(item => item.id !== assetId));
      setSuccessMessage(`Asset "${deleteTarget.title}" deleted successfully.`);
      setLoadError(null);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      setDeleteError(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        redirectToHome();
        return;
      }
      const message = error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Failed to delete asset.';
      setDeleteError(message);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleSubmitAsset = async () => {
    if (!assetPayload.trim()) {
      setAssetError('Please paste a valid JSON payload.');
      return;
    }

    setAssetError(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(assetPayload);
    } catch (error) {
      setAssetError('JSON parsing failed. Please provide valid JSON.');
      return;
    }

    if (parsed === null || typeof parsed !== 'object') {
      setAssetError('Payload must be a JSON object.');
      return;
    }

    if (modalMode === 'edit' && !editingAssetId) {
      setAssetError('Unable to determine which asset to update. Please close and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      let saved: Asset;
      if (modalMode === 'create') {
        saved = await createAsset(parsed as UpsertAssetPayload);
        setRemoteAssets(prev => [saved, ...prev]);
        setSuccessMessage(`Asset "${saved.title}" created successfully.`);
      } else {
        saved = await updateAsset(editingAssetId!, parsed as UpsertAssetPayload);
        setRemoteAssets(prev => prev.map(item => (item.id === saved.id ? saved : item)));
        setSuccessMessage(`Asset "${saved.title}" updated successfully.`);
      }

      setIsAssetModalOpen(false);
      setLoadError(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        redirectToHome();
        return;
      }
      const message = error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : modalMode === 'create'
            ? 'Failed to create asset.'
            : 'Failed to update asset.';
      setAssetError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 bg-white">
          <div className="px-6 py-5 space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Admin Panel</span>
              <h1 className="mt-2 text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              type="button"
              onClick={redirectToHome}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 text-sm">
            <a href="#" className="flex items-center justify-between rounded-xl bg-gray-900 text-white px-4 py-2 font-medium">
              <span>Overview</span>
              <span className="text-xs bg-gray-800/60 px-2 py-0.5 rounded-full">Active</span>
            </a>
            <a href="#" className="flex items-center justify-between rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100">
              <span>Asset Library</span>
              <span className="text-xs text-gray-400">{summary.total}</span>
            </a>
            <a href="#" className="flex items-center justify-between rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100">
              <span>Scenes</span>
              <span className="text-xs text-gray-400">{summary.byType.Scene}</span>
            </a>
            <a href="#" className="flex items-center justify-between rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100">
              <span>Textures</span>
              <span className="text-xs text-gray-400">{summary.byType.Texture}</span>
            </a>
            <a href="#" className="flex items-center justify-between rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100">
              <span>Team</span>
              <span className="text-xs text-gray-400">4</span>
            </a>
            <div className="pt-4">
              <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">Management</span>
              <a href="#" className="mt-2 flex items center justify-between rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100">
                <span>Billing</span>
                <span className="text-xs text-gray-400">Coming soon</span>
              </a>
              <a href="#" className="mt-1 flex items-center justify-between rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100">
                <span>Support tickets</span>
                <span className="text-xs text-gray-400">2 open</span>
              </a>
            </div>
          </nav>
          <div className="px-6 py-4 mt-auto">
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-900">Storage usage</h2>
              <p className="mt-2 text-xs text-gray-500">72% of the workspace storage is in use.</p>
              <div className="mt-3 h-2 rounded-full bg-gray-200">
                <div className="h-full w-[72%] rounded-full bg-gray-900" />
              </div>
              <button type="button" className="mt-4 w-full rounded-xl border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Manage storage
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-gray-200 bg-white">
            <div className="flex flex-col gap-4 px-6 py-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Products</h2>
                  <p className="text-sm text-gray-500">Manage the 3D assets available in the catalog.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search assets"
                    value={searchValue}
                    onChange={event => setSearchValue(event.target.value)}
                    className="w-full sm:w-64 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative" ref={filterContainerRef}>
                    <button
                      type="button"
                      onClick={() => setIsFilterPanelOpen(prev => !prev)}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      aria-haspopup="true"
                      aria-expanded={isFilterPanelOpen}
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                      {activeFilterCount > 0 && (
                        <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                    {isFilterPanelOpen && (
                      <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-xl">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Status</p>
                          <div className="mt-2 space-y-2">
                            {statusFilterOptions.map(option => (
                              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="radio"
                                  name="asset-status-filter"
                                  value={option.value}
                                  checked={statusFilter === option.value}
                                  onChange={() => setStatusFilter(option.value)}
                                  className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-400"
                                />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={showOnlyFree}
                              onChange={event => setShowOnlyFree(event.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                            />
                            Free assets only
                          </label>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setStatusFilter('ALL');
                              setShowOnlyFree(false);
                              setIsFilterPanelOpen(false);
                            }}
                            className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsFilterPanelOpen(false)}
                            className="rounded-xl bg-gray-900 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-800"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    <Plus className="h-4 w-4" />
                    Add asset
                  </button>
                </div>
              </div>
            </div>
           </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
            {isLoading && (
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
                <LoadingSpinner label="Loading assets from the API…" />
              </div>
            )}

            {loadError && !isLoading && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <div>
                  <p className="font-semibold">Unable to reach the asset API.</p>
                  <p>{loadError}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <span>{successMessage}</span>
                <button
                  type="button"
                  onClick={() => setSuccessMessage(null)}
                  className="rounded-full border border-emerald-200 bg-emerald-100 p-1.5 text-emerald-700 hover:bg-emerald-200"
                  aria-label="Dismiss success message"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total assets</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{summary.total}</p>
                <p className="text-xs text-gray-500">Across models, scenes, and textures.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Free assets</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{summary.free}</p>
                <p className="text-xs text-gray-500">Assets available without credits.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Average views</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{summary.averageViews}</p>
                <p className="text-xs text-gray-500">Per asset over the last period.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">By category</p>
                <p className="mt-2 text-sm text-gray-700">
                  {summary.byType.Model} models • {summary.byType.Scene} scenes • {summary.byType.Texture} textures • {summary.byType.Featured} featured
                </p>
                <p className="text-xs text-gray-500">Use filters to drill down further.</p>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Products list</h3>
                  <p className="text-xs text-gray-500">Showing {rows.length} records pulled from {dataSourceLabel}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500">
                  {typeFilterOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTypeFilter(option.value)}
                      className={getTypeButtonClass(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Product</th>
                      <th className="px-6 py-3 text-left font-semibold">Type</th>
                      <th className="px-6 py-3 text-left font-semibold">Category</th>
                      <th className="px-6 py-3 text-left font-semibold">Author</th>
                      <th className="px-6 py-3 text-left font-semibold">Credits</th>
                      <th className="px-6 py-3 text-left font-semibold">Views</th>
                      <th className="px-6 py-3 text-left font-semibold">Likes</th>
                      <th className="px-6 py-3 text-left font-semibold">Updated</th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12 text-center text-sm text-gray-500">
                          {isSearchActive
                            ? `No assets matched "${debouncedSearchValue}".`
                            : hasFetchedRemoteAssets
                              ? 'No assets available yet.'
                              : 'Loading sample catalog data.'}
                        </td>
                      </tr>
                    ) : (
                      rows.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{row.title}</p>
                            <p className="text-xs text-gray-500">ID: {row.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{row.type}</td>
                        <td className="px-6 py-4 text-gray-600">{row.category}</td>
                        <td className="px-6 py-4 text-gray-600">{row.author}</td>
                        <td className="px-6 py-4 text-gray-600">{row.credits}</td>
                        <td className="px-6 py-4 text-gray-600">{row.views.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{row.likes.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{row.updatedAt}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusToneClass[row.statusTone]}`}>
                            {row.statusLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {hasRemoteAssets && (
                            <div className="relative inline-block text-left" data-asset-menu-root>
                              <button
                                type="button"
                                data-asset-menu-trigger
                                onClick={() => setOpenRowMenuId(prev => (prev === row.id ? null : row.id))}
                                disabled={isDeletingId === row.id}
                                className="inline-flex items-center rounded-full border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              {openRowMenuId === row.id && (
                                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white py-1 text-left shadow-xl z-30" data-asset-menu>
                                  <button
                                    type="button"
                                    onClick={() => handleEditAsset(row.id)}
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit JSON
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => confirmDeleteAsset(row.id)}
                                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    disabled={isDeletingId === row.id}
                                  >
                                    {isDeletingId === row.id ? 'Deleting…' : 'Delete'}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>

      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'create' ? 'Create asset from JSON' : 'Edit asset JSON'}
                </h2>
                <p className="text-sm text-gray-500">
                  {modalMode === 'create'
                    ? 'Paste the asset payload that should be stored in DynamoDB.'
                    : 'Update the asset payload below and save to persist the changes.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAssetModal}
                className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Required fields: title, image, type.</span>
                {modalMode === 'create' ? (
                  <button
                    type="button"
                    onClick={() => setAssetPayload(JSON.stringify(sampleAssetPayload, null, 2))}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Load sample
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingAssetId) {
                        return;
                      }
                      const asset = remoteAssets.find(item => item.id === editingAssetId);
                      if (asset) {
                        setAssetPayload(JSON.stringify(asset, null, 2));
                      }
                    }}
                    disabled={!editingAssetId}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Reset payload
                  </button>
                )}
              </div>

              <textarea
                value={assetPayload}
                onChange={event => setAssetPayload(event.target.value)}
                className="h-64 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-xs text-gray-800 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder='{"title": "Asset name", ...}'
              />

              {assetError && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
                  <span>{assetError}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={closeAssetModal}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitAsset}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {isSubmitting
                  ? 'Saving…'
                  : modalMode === 'create'
                    ? 'Create asset'
                    : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-xl">
            <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-5">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">Delete asset</h2>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{deleteTarget.title}"? This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"
                disabled={Boolean(isDeletingId)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {deleteError && (
              <div className="mx-6 mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 px-6 py-5">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                disabled={Boolean(isDeletingId)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAsset}
                disabled={Boolean(isDeletingId)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                <Trash className="h-4 w-4" />
                {isDeletingId === deleteTarget.id ? 'Deleting…' : 'Delete asset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
