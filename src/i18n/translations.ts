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
        onDemand: {
          name: 'On-Demand',
          description: 'Download the 3D models you need, whenever you need them. Single user.',
          payment: 'pricingPage.planLabels.paymentYearly',
          creditsLabel: 'pricingPage.planLabels.creditsPerPack',
        },
        basic: {
          name: 'Basic',
          description: 'Pick the right amount of 3D models each month. Perfect for lighter workloads.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        premium: {
          name: 'Premium',
          description: 'Download as many 3D models as you need with generous monthly credits.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        pro: {
          name: 'Pro',
          description: 'Advanced users who need large amounts of credits for demanding projects.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        team: {
          name: 'Team',
          description: 'Collaborate with your team and share a large pool of credits across members.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
          note: 'Up to 10 team members',
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
          question: 'Is the On-Demand pack refundable?',
          answer: 'On-Demand purchases are final, but you can upgrade to a subscription within 7 days for a prorated credit.',
        },
        q4: {
          question: 'Can I invite more team members later?',
          answer: 'Team plans support up to 10 members. Contact support if you need a larger seat count.',
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
        onDemand: {
          name: 'İhtiyaç Halinde',
          description: 'Gerektiğinde 3D modeller indirin. Tek kullanıcı.',
          payment: 'pricingPage.planLabels.paymentYearly',
          creditsLabel: 'pricingPage.planLabels.creditsPerPack',
        },
        basic: {
          name: 'Temel',
          description: 'Aylık hafif ihtiyaçlar için doğru kredi miktarını seçin. Tek kullanıcı.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        premium: {
          name: 'Premium',
          description: 'Geniş aylık kredilerle ihtiyaç duyduğunuz kadar 3D model indirin.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        pro: {
          name: 'Profesyonel',
          description: 'Yoğun projeler için yüksek kredi limitine sahip gelişmiş kullanıcılar.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
        },
        team: {
          name: 'Takım',
          description: 'Ekibinizle iş birliği yapın ve ortak kredi havuzunu paylaşın.',
          payment: 'pricingPage.planLabels.paymentMonthly',
          creditsLabel: 'pricingPage.planLabels.creditsPerMonth',
          note: '10 ekip üyesine kadar',
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
          question: 'İhtiyaç Halinde paketi iade edebilir miyim?',
          answer: 'İhtiyaç Halinde satın alımları iade edilmez, ancak 7 gün içinde aboneliğe yükseltirseniz orantılı kredi eklenir.',
        },
        q4: {
          question: 'Daha sonra daha fazla ekip üyesi davet edebilir miyim?',
          answer: 'Takım planları 10 üyeye kadar destekler. Daha fazla koltuk için destek ile iletişime geçin.',
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
  },
};

export const availableLanguages: Language[] = ['en', 'tr'];