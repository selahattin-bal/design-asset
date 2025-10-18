export type Language = 'en' | 'tr';

type TranslationLeaf = string | Record<string, unknown>;

type Translations = Record<Language, Record<string, TranslationLeaf>>;

export const translations: Translations = {
  en: {
    nav: {
      models: '3D Models',
      scenes: '3D Scenes',
      textures: 'Textures',
      brands: 'Brands',
      artists: 'Artists',
      works: 'Works',
      blog: 'Blog',
      allModels: 'All 3D Models',
      allScenes: 'All 3D Scenes',
      pricing: 'Pricing',
      myAssets: 'My Assets',
      cart: 'Cart',
      dashboard: 'Dashboard',
    },
    hero: {
      titleLine1: 'The First Digital Platform',
      titleLine2: 'Designed for Designers',
      subtitle:
        'Access thousands of professional 3D models, scenes, and textures curated specifically for architects, interior designers, and creative professionals.',
      primaryCta: 'Explore Resources',
      secondaryCta: 'Learn More',
    },
    searchPlaceholder: 'Search assets or start creating',
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
    },
      dashboard: 'Yönetim',
    authPages: {
      common: {
        emailLabel: 'Email',
        emailPlaceholder: 'name@example.com',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter at least 8 characters',
        dividerLabel: 'or',
        loadingLabel: 'Please wait…',
        successMessage: 'Request sent. Check the console log for the mocked API call.',
        errorMessage: 'Something went wrong. Please try again.',
        googleButton: 'Continue with Google',
      },
      signIn: {
        title: 'Welcome back',
        subtitle: 'Log in to access your workspace and saved assets.',
        submitLabel: 'Sign In',
        forgotPassword: 'Forgot password?',
        secondaryPrompt: "Don't have an account?",
        secondaryAction: 'Create one',
      },
      signUp: {
        title: 'Create an account',
        subtitle: 'Join the community of designers and start downloading premium assets.',
        submitLabel: 'Sign Up',
        confirmPasswordLabel: 'Confirm password',
        confirmPasswordPlaceholder: 'Repeat your password',
        passwordMismatch: 'Passwords do not match. Please try again.',
        termsNotice:
          'By registering you agree to our <a class="font-semibold text-gray-900 hover:underline" href="#">Terms of Service</a> and <a class="font-semibold text-gray-900 hover:underline" href="#">Privacy Policy</a>.',
        secondaryPrompt: 'Already have an account?',
        secondaryAction: 'Sign in',
      },
      forgotPassword: {
        title: 'Reset your password',
        subtitle: 'Enter your email and we will send you instructions to create a new password.',
        submitLabel: 'Send reset link',
        successMessage: 'If an account exists, we sent password reset instructions to your email.',
        backToSignIn: 'Back to sign in',
      },
    },
    language: {
      label: 'Language',
      english: 'English',
      turkish: 'Turkish',
    },
    sections: {
      newModels: 'New 3D Models',
      newScenes: 'New 3D Scenes',
      newTextures: 'New Textures',
      featuredWorks: 'Featured Works',
      youMightAlsoLike: 'You might also like',
      viewAllModels: 'View all models',
      viewAllScenes: 'View all scenes',
      viewAllTextures: 'View all textures',
    },
    buttons: {
      viewAll: 'View All →',
      reset: 'Reset',
      copyLink: 'Copy Link',
      save: 'Save',
      getMoreCredits: 'Get More Credits',
      languageToggle: 'EN / TR',
    },
    filters: {
      catalog: 'Catalog',
      category: 'Category',
      type: 'Type',
      surface: 'Surface',
      all: 'All',
      furniture: 'Furniture',
      decoration: 'Decoration',
      lighting: 'Lighting',
      technology: 'Technology',
      interior: 'Interior',
      exterior: 'Exterior',
      commercial: 'Commercial',
      wood: 'Wood',
      concrete: 'Concrete',
      fabric: 'Fabric',
      workspace: 'Workspace',
      bedroom: 'Bedroom',
      otherModels: 'Other Models',
      childroom: 'Childroom',
      bathroom: 'Bathroom',
      kitchen: 'Kitchen',
      decorationAccent: 'Decoration',
    },
    modelsPage: {
      description:
        'Explore our complete library of premium 3D models curated for interior and exterior projects.',
    },
    scenesPage: {
      description:
        'Discover immersive scene compositions ready to showcase residential and commercial designs.',
    },
    texturesPage: {
      description: 'Browse ready-to-use texture packs to speed up your material workflow.',
    },
    pricingPage: {
      title: 'Get the ideal plan for your projects',
      subtitle:
        'Access thousands of professional 3D assets curated for architects, interior designers, and creative studios.',
      notification:
        'Prices are shown in United States dollars and Turkish lira. Taxes may apply at checkout.',
      currencyToggle: {
        usd: 'USD',
        try: 'TL',
      },
      planLabels: {
        creditsPerMonth: 'Credits per month',
        creditsPerYear: 'Credits per year',
        creditsPerPack: 'Credits per pack',
        paymentMonthly: 'Monthly subscription',
        paymentYearly: 'One-time payment',
        badgeBestValue: 'Best Value',
      },
      plans: {
        basic: {
          name: 'Basic',
          description: '200 monthly credits to download essential 3D assets for lighter workloads.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        premium: {
          name: 'Premium',
          description: '500 monthly credits for professional designers who need a larger library.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        pro: {
          name: 'Pro',
          description: '1000 monthly credits for studios handling intensive 3D production workloads.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
      },
      actions: {
        getStarted: 'Get started',
      },
      faq: {
        title: 'Frequently asked questions',
        q1: {
          question: 'How do the subscription plans work?',
          answer: 'Each subscription renews automatically every month. Unused credits roll over for 30 days.',
        },
        q2: {
          question: 'Can I switch between USD and TL billing later?',
          answer: 'Yes. Choose your preferred currency at checkout. You can update it before the next renewal.',
        },
        q3: {
          question: 'Can I change plans later?',
          answer: 'You can upgrade or downgrade at any time. Unused credits stay available for 30 days after the change.',
        },
        q4: {
          question: 'How do credit resets work?',
          answer: 'Credits refresh automatically at the end of each billing cycle. Free plans refresh every day.',
        },
        q5: {
          question: 'Do credits expire?',
          answer: 'Subscription credits expire 30 days after the billing cycle ends. Team credits reset each month.',
        },
      },
    },
    asset: {
      free: 'Free',
      credits: '{{count}} Credits',
      dailyCredits: 'Daily Credits: {{remaining}} / {{total}}',
    },
    detail: {
      overview: 'Overview',
      share: 'Share',
    },
    breadcrumbs: {
      home: 'Home',
    },
    footer: {
      resources: 'Resources',
      company: 'Company',
      legal: 'Legal',
      about: 'About',
      contact: 'Contact',
      careers: 'Careers',
      press: 'Press',
      terms: 'Terms',
      privacy: 'Privacy',
      cookies: 'Cookies',
      licenses: 'Licenses',
      copyright: '© {{year}} LARUUS. All rights reserved.',
    },
    profile: {
      accountSettings: 'Account settings',
      signOut: 'Sign out',
    },
    account: {
      profile: {
        anonymous: 'Guest user',
        roleLabel: 'Interior design enthusiast',
        upgradeCta: 'Upgrade plan',
      },
      sidebar: {
        plan: {
          label: 'Plan',
          valueFree: 'Free plan',
          dailyCredits: 'Daily limit: {{limit}} credits',
          monthlyCredits: 'Monthly limit: {{limit}} credits',
        },
        billing: {
          label: 'Billing',
          value: 'Manage invoices and receipts',
        },
        paymentMethods: {
          label: 'Payment methods',
          value: 'Add or update your cards',
        },
        collections: {
          label: 'Collections',
          value: '0 active collections',
        },
        purchases: {
          label: 'Purchases',
          value: '0 recent purchases',
        },
        editProfile: {
          label: 'Edit profile',
          value: 'Customize your public page',
        },
      },
      content: {
        placeholderTitle: 'Choose an option from the sidebar',
        placeholderSubtitle:
          'We will show detailed settings here once the selected module is implemented.',
        activityTitle: 'Quick activity overview',
        activitySubtitle: 'A snapshot of your collections and purchases will appear in this area.',
        profileTitle: 'Profile preferences',
        profileSubtitle: 'Manage your personal information and security options.',
        profileDetailsTitle: 'Public profile',
        profileDetailsSubtitle: 'Update your display name and portfolio details (coming soon).',
        profileEditCta: 'Edit profile',
        resetPasswordTitle: 'Reset your password',
        resetPasswordSubtitle: 'Need a new password? We will send a secure reset link to your inbox.',
        resetPasswordCta: 'Send reset email',
        resetPasswordHint: 'You will be redirected to the password reset form on the next page.',
  creditSummaryTitle: 'Credit balance',
  creditSummaryBalance: '{{balance}} credits remaining out of {{limit}}',
  creditSummaryReset: 'Resets on {{date}}',
      },
    },
  },
  tr: {
    nav: {
      models: '3D Modeller',
      scenes: '3D Sahne',
      textures: 'Dokular',
      brands: 'Markalar',
      artists: 'Sanatçılar',
      works: 'Çalışmalar',
      blog: 'Blog',
      allModels: 'Tüm 3D Modeller',
      allScenes: 'Tüm 3D Sahne',
      pricing: 'Fiyatlandırma',
      myAssets: 'Varlıklarım',
      cart: 'Sepet',
    },
    hero: {
      titleLine1: 'İlk Dijital Platform',
      titleLine2: 'Tasarımcılar İçin Tasarlandı',
      subtitle:
        'Mimarlar, iç mimarlar ve yaratıcı profesyoneller için özenle seçilmiş binlerce profesyonel 3D model, sahne ve dokuya erişin.',
      primaryCta: 'Kaynakları Keşfet',
      secondaryCta: 'Daha Fazla Bilgi Al',
    },
    searchPlaceholder: 'Varlık arayın veya üretmeye başlayın',
    auth: {
      signIn: 'Giriş Yap',
      signUp: 'Kayıt Ol',
    },
    authPages: {
      common: {
        emailLabel: 'E-posta',
        emailPlaceholder: 'isim@orneksite.com',
        passwordLabel: 'Şifre',
        passwordPlaceholder: 'En az 8 karakter girin',
        dividerLabel: 'veya',
        loadingLabel: 'Lütfen bekleyin…',
        successMessage: 'İstek gönderildi. Sahte API çağrısı konsola yazdırıldı.',
        errorMessage: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
        googleButton: 'Google ile devam et',
      },
      signIn: {
        title: 'Tekrar hoş geldiniz',
        subtitle: 'Çalışma alanınıza ve kaydedilmiş varlıklara erişmek için giriş yapın.',
        submitLabel: 'Giriş Yap',
        forgotPassword: 'Şifremi unuttum',
        secondaryPrompt: 'Hesabınız yok mu?',
        secondaryAction: 'Hemen oluşturun',
      },
      signUp: {
        title: 'Hesap oluşturun',
        subtitle: 'Tasarımcı topluluğuna katılın ve premium varlıkları indirmeye başlayın.',
        submitLabel: 'Kayıt Ol',
        confirmPasswordLabel: 'Şifreyi doğrulayın',
        confirmPasswordPlaceholder: 'Şifrenizi tekrar girin',
        passwordMismatch: 'Şifreler eşleşmiyor. Lütfen tekrar deneyin.',
        termsNotice:
          'Kayıt olarak <a class="font-semibold text-gray-900 hover:underline" href="#">Hizmet Şartlarımızı</a> ve <a class="font-semibold text-gray-900 hover:underline" href="#">Gizlilik Politikamızı</a> kabul etmiş olursunuz.',
        secondaryPrompt: 'Zaten hesabınız var mı?',
        secondaryAction: 'Giriş yapın',
      },
      forgotPassword: {
        title: 'Şifrenizi sıfırlayın',
        subtitle: 'E-postanızı girin, yeni bir şifre oluşturmanız için bağlantı gönderelim.',
        submitLabel: 'Sıfırlama bağlantısı gönder',
        successMessage: 'Hesabınız varsa şifre sıfırlama talimatlarını e-postanıza gönderdik.',
        backToSignIn: 'Giriş ekranına dön',
      },
    },
    language: {
      label: 'Dil',
      english: 'İngilizce',
      turkish: 'Türkçe',
    },
    sections: {
      newModels: 'Yeni 3D Modeller',
      newScenes: 'Yeni 3D Sahne',
      newTextures: 'Yeni Dokular',
      featuredWorks: 'Öne Çıkan Çalışmalar',
      youMightAlsoLike: 'Bunları da beğenebilirsiniz',
      viewAllModels: 'Tüm modelleri gör',
      viewAllScenes: 'Tüm sahneleri gör',
      viewAllTextures: 'Tüm dokuları gör',
    },
    buttons: {
      viewAll: 'Tümünü Gör →',
      reset: 'Sıfırla',
      copyLink: 'Bağlantıyı Kopyala',
      save: 'Kaydet',
      getMoreCredits: 'Daha Fazla Kredi Al',
      languageToggle: 'TR / EN',
    },
    filters: {
      catalog: 'Katalog',
      category: 'Kategori',
      type: 'Tür',
      surface: 'Yüzey',
      all: 'Tümü',
      furniture: 'Mobilya',
      decoration: 'Dekorasyon',
      lighting: 'Aydınlatma',
      technology: 'Teknoloji',
      interior: 'İç Mekan',
      exterior: 'Dış Mekan',
      commercial: 'Ticari',
      wood: 'Ahşap',
      concrete: 'Beton',
      fabric: 'Kumaş',
      workspace: 'Çalışma Alanı',
      bedroom: 'Yatak Odası',
      otherModels: 'Diğer Modeller',
      childroom: 'Çocuk Odası',
      bathroom: 'Banyo',
      kitchen: 'Mutfak',
      decorationAccent: 'Dekorasyon',
    },
    modelsPage: {
      description:
        'İç ve dış mekan projeleri için seçilmiş premium 3D model arşivimizin tamamını keşfedin.',
    },
    scenesPage: {
      description:
        'Konut ve ticari tasarımları sergilemeye hazır sahne kompozisyonlarını keşfedin.',
    },
    texturesPage: {
      description: 'Malzeme iş akışınızı hızlandıracak kullanıma hazır doku paketlerine göz atın.',
    },
    pricingPage: {
      title: 'Projeleriniz için ideal planı seçin',
      subtitle:
        'Mimarlar, iç mimarlar ve kreatif stüdyolar için seçilmiş binlerce profesyonel 3D varlığa erişin.',
      notification:
        'Fiyatlar Amerika Birleşik Devletleri doları ve Türk lirası olarak gösterilir. Satın alma sırasında vergiler uygulanabilir.',
      currencyToggle: {
        usd: 'USD',
        try: 'TL',
      },
      planLabels: {
        creditsPerMonth: 'Aylık kredi',
        creditsPerYear: 'Yıllık kredi',
        creditsPerPack: 'Paket başına kredi',
        paymentMonthly: 'Aylık abonelik',
        paymentYearly: 'Tek seferlik ödeme',
        badgeBestValue: 'En iyi seçenek',
      },
      plans: {
        basic: {
          name: 'Temel',
          description: '200 aylık krediyle hafif projeler için gerekli 3D varlıkları indirin.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        premium: {
          name: 'Premium',
          description: '500 aylık kredi profesyonel tasarımcıların daha büyük arşive erişmesini sağlar.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        pro: {
          name: 'Profesyonel',
          description: '1000 aylık kredi yoğun 3D üretim süreçlerini yöneten stüdyolar için idealdir.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
      },
      actions: {
        getStarted: 'Başla',
      },
      faq: {
        title: 'Sık sorulan sorular',
        q1: {
          question: 'Abonelik planları nasıl çalışır?',
          answer: 'Her abonelik her ay otomatik olarak yenilenir. Kullanılmayan krediler 30 gün boyunca devredilir.',
        },
        q2: {
          question: 'Daha sonra USD ve TL arasında geçiş yapabilir miyim?',
          answer: 'Evet. Ödeme sırasında tercih ettiğiniz para birimini seçebilirsiniz. Yenilemeden önce güncelleyebilirsiniz.',
        },
        q3: {
          question: 'Planımı daha sonra değiştirebilir miyim?',
          answer: 'İstediğiniz zaman plan yükseltebilir veya düşürebilirsiniz. Kullanılmayan krediler değişiklikten sonra 30 gün daha kullanılabilir.',
        },
        q4: {
          question: 'Kredi yenilemesi nasıl çalışır?',
          answer: 'Krediler her fatura döneminin sonunda otomatik olarak yenilenir. Ücretsiz planlar her gün yenilenir.',
        },
        q5: {
          question: 'Kredilerim ne zaman sona erer?',
          answer: 'Abonelik kredileri fatura dönemi bittikten 30 gün sonra sona erer. Takım kredileri her ay yenilenir.',
        },
      },
    },
    asset: {
      free: 'Ücretsiz',
      credits: '{{count}} Kredi',
      dailyCredits: 'Günlük Krediler: {{remaining}} / {{total}}',
    },
    detail: {
      overview: 'Genel Bakış',
      share: 'Paylaş',
    },
    breadcrumbs: {
      home: 'Ana Sayfa',
    },
    footer: {
      resources: 'Kaynaklar',
      company: 'Şirket',
      legal: 'Yasal',
      about: 'Hakkımızda',
      contact: 'İletişim',
      careers: 'Kariyer',
      press: 'Basın',
      terms: 'Şartlar',
      privacy: 'Gizlilik',
      cookies: 'Çerezler',
      licenses: 'Lisanslar',
      copyright: '© {{year}} LARUUS. Tüm hakları saklıdır.',
    },
    profile: {
      accountSettings: 'Hesap ayarları',
      signOut: 'Çıkış yap',
    },
    account: {
      profile: {
        anonymous: 'Misafir kullanıcı',
        roleLabel: 'İç tasarım meraklısı',
        upgradeCta: 'Planı yükselt',
      },
      sidebar: {
        plan: {
          label: 'Plan',
          valueFree: 'Ücretsiz plan',
          dailyCredits: 'Günlük limit: {{limit}} kredi',
          monthlyCredits: 'Aylık limit: {{limit}} kredi',
        },
        billing: {
          label: 'Faturalandırma',
          value: 'Faturaları ve makbuzları yönetin',
        },
        paymentMethods: {
          label: 'Ödeme yöntemleri',
          value: 'Kart ekleyin veya güncelleyin',
        },
        collections: {
          label: 'Koleksiyonlar',
          value: '0 aktif koleksiyon',
        },
        purchases: {
          label: 'Satın almalar',
          value: '0 son satın alma',
        },
        editProfile: {
          label: 'Profili düzenle',
          value: 'Herkese açık sayfanı kişiselleştir',
        },
      },
      content: {
        placeholderTitle: 'Menüden bir seçenek seçin',
        placeholderSubtitle:
          'Seçilen modül hazır olduğunda ayrıntılı ayarları burada göstereceğiz.',
        activityTitle: 'Hızlı etkinlik özeti',
        activitySubtitle: 'Koleksiyon ve satın alma özetleri bu alanda görünecek.',
        profileTitle: 'Profil tercihleri',
        profileSubtitle: 'Kişisel bilgilerinizi ve güvenlik ayarlarınızı yönetin.',
        profileDetailsTitle: 'Herkese açık profil',
        profileDetailsSubtitle: 'Görünen adınızı ve portföy detaylarını güncelleyin (yakında).',
        profileEditCta: 'Profili düzenle',
        resetPasswordTitle: 'Şifreyi sıfırla',
        resetPasswordSubtitle: 'Yeni bir şifreye mi ihtiyacınız var? Güvenli bağlantıyı e-postanıza gönderelim.',
        resetPasswordCta: 'Şifre sıfırlama e-postası gönder',
        resetPasswordHint: 'Bir sonraki sayfada şifre sıfırlama formuna yönlendirileceksiniz.',
  creditSummaryTitle: 'Kredi bakiyesi',
  creditSummaryBalance: '{{limit}} krediden {{balance}} kaldı',
  creditSummaryReset: '{{date}} tarihinde yenilenir',
      },
    },
  },
};

export const availableLanguages: Language[] = ['en', 'tr'];