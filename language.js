(() => {
  'use strict';

  const STORAGE_KEY = 'ejmLanguage';
  const supported = ['en', 'id'];

  const idMap = {
    'Home': 'Beranda',
    'About Us': 'Tentang Kami',
    'Services': 'Layanan',
    'Gallery': 'Galeri',
    'Testimonials': 'Testimoni',
    'Location': 'Lokasi',
    'Locations': 'Lokasi',
    'Sign Up Now': 'Daftar Sekarang',
    'Welcome to': 'Selamat Datang di',
    'Licensed Indonesian Migrant Worker Placement Company (P3MI) with more than 30 years of experience in international workforce placement.': 'Perusahaan Penempatan Pekerja Migran Indonesia (P3MI) berizin dengan pengalaman lebih dari 30 tahun dalam penempatan tenaga kerja internasional.',
    'Partner With Us': 'Bermitra dengan Kami',
    'Explore Our Services': 'Lihat Layanan Kami',
    'Years of Experience': 'Tahun Pengalaman',
    'PT Ekasanti Jayamulia is an Indonesian Migrant Workers Placement Company (P3MI) established in 1991 and licensed by the Minister of Manpower to provide services for the placement of Indonesian migrant workers abroad.': 'PT Ekasanti Jayamulia adalah Perusahaan Penempatan Pekerja Migran Indonesia (P3MI) yang didirikan pada tahun 1991 dan berizin dari Menteri Ketenagakerjaan untuk menyediakan layanan penempatan pekerja migran Indonesia ke luar negeri.',
    'Why Us?': 'Mengapa Kami?',
    'Over 30 Years of Industry Experience': 'Lebih dari 30 Tahun Pengalaman di Industri',
    'Safe, Legal, and Government-Regulated Placement': 'Penempatan Aman, Legal, dan Sesuai Regulasi Pemerintah',
    'Global Workforce Placement Network': 'Jaringan Penempatan Tenaga Kerja Global',
    'Commitment to Quality and Worker Welfare': 'Komitmen terhadap Kualitas dan Kesejahteraan Pekerja',
    'End-to-End Worker Protection, from Departure to Return': 'Perlindungan Pekerja Menyeluruh, dari Keberangkatan hingga Kepulangan',
    'Our Services': 'Layanan Kami',
    'Comprehensive Workforce Solutions': 'Solusi Tenaga Kerja yang Komprehensif',
    'Work With Us': 'Bekerja Sama dengan Kami',
    'Recruitment, Training and Selection': 'Rekrutmen, Pelatihan, dan Seleksi',
    'Document Processing': 'Pengurusan Dokumen',
    'Placement and Departure Arrangement': 'Penempatan dan Pengaturan Keberangkatan',
    'Placement Monitoring & Support': 'Pemantauan & Dukungan Penempatan',
    'Destination Countries': 'Negara Tujuan',
    'Global Opportunities': 'Peluang Global',
    'for Indonesian Talent': 'untuk Talenta Indonesia',
    'We have placed Indonesian workers in various countries and continue to expand to new markets.': 'Kami telah menempatkan pekerja Indonesia di berbagai negara dan terus memperluas jangkauan ke pasar baru.',
    'Other destinations are subject to applicable government regulations.': 'Negara tujuan lainnya mengikuti ketentuan dan regulasi pemerintah yang berlaku.',
    'Employment Sectors': 'Sektor Pekerjaan',
    'Manpower Solutions': 'Solusi Tenaga Kerja',
    'Across Industries': 'di Berbagai Industri',
    'We provide workforce solutions across multiple sectors, including but not limited to:': 'Kami menyediakan solusi tenaga kerja di berbagai sektor, termasuk namun tidak terbatas pada:',
    'Manufacturing &': 'Manufaktur &',
    'Industrial Production': 'Produksi Industri',
    'Automotive': 'Otomotif',
    'Industry': 'Industri',
    'Hospitality': 'Hospitality',
    'Warehouse &': 'Pergudangan &',
    'Logistics': 'Logistik',
    'Construction &': 'Konstruksi &',
    'Technical Services': 'Layanan Teknis',
    'Domestic': 'Pekerja',
    'Workers': 'Domestik',
    'Our Activities': 'Aktivitas Kami',
    'Training, preparation, departure, and moments throughout the placement journey': 'Pelatihan, persiapan, keberangkatan, dan berbagai momen sepanjang proses penempatan',
    'Click a photo to view full size.': 'Klik foto untuk melihat ukuran penuh.',
    '9 photos': '9 foto',
    'Their Journey With Us': 'Perjalanan Mereka Bersama Kami',
    'What our PMI say about their preparation and placement experience with PT Ekasanti Jayamulia': 'Cerita PMI kami mengenai pengalaman persiapan dan penempatan bersama PT Ekasanti Jayamulia',
    'Visit Our Locations': 'Kunjungi Lokasi Kami',
    'Head Office': 'Kantor Pusat',
    'Training': 'Pelatihan',
    'Working hours': 'Jam Operasional',
    'Monday - Friday, 9 AM - 5 PM': 'Senin - Jumat, 09.00 - 17.00',
    'View location': 'Lihat lokasi',
    'Ready to Work Together?': 'Siap Memulai Bersama Kami?',
    'Whether you are a job seeker or an employer, we are here to support you.': 'Baik Anda pencari kerja maupun pemberi kerja, kami siap mendukung kebutuhan Anda.',
    'For Job Seekers': 'Untuk Pencari Kerja',
    'For Employers': 'Untuk Pemberi Kerja',
    'Become Our Partner': 'Jadi Mitra Kami',
    'Connecting Indonesian talent to global opportunities through responsible and professional workforce placement services.': 'Menghubungkan talenta Indonesia dengan peluang global melalui layanan penempatan tenaga kerja yang bertanggung jawab dan profesional.',
    'Quick Links': 'Tautan Cepat',
    'Contact': 'Kontak',
    'Follow Us': 'Ikuti Kami',
    '© 2026 PT Ekasanti Jayamulia. All rights reserved.': '© 2026 PT Ekasanti Jayamulia. Seluruh hak cipta dilindungi.',
    'Privacy Policy': 'Kebijakan Privasi',
    'Terms of Service': 'Ketentuan Layanan',
    'Swipe or use the arrows to browse. Press Esc to close.': 'Geser atau gunakan tombol panah untuk melihat foto. Tekan Esc untuk menutup.',

    // Registration page
    'Job Seeker Registration': 'Pendaftaran Pencari Kerja',
    'Sign Up / Pendaftaran': 'Pendaftaran',
    'Fill in your information below. Our team will review your submission and contact you through WhatsApp for further information.': 'Isi informasi Anda di bawah ini. Tim kami akan meninjau data yang dikirim dan menghubungi Anda melalui WhatsApp untuk informasi lebih lanjut.',
    'All fields are required, except Question.': 'Semua kolom wajib diisi, kecuali Pertanyaan.',
    'Registration': 'Pendaftaran',
    'Start Your Overseas Work Journey': 'Mulai Perjalanan Kerja Anda ke Luar Negeri',
    'Please provide accurate information so our team can contact and assist you appropriately.': 'Mohon berikan informasi yang akurat agar tim kami dapat menghubungi dan membantu Anda dengan tepat.',
    'Complete the form': 'Lengkapi formulir',
    'Fill in your personal information and WhatsApp number.': 'Isi informasi pribadi dan nomor WhatsApp Anda.',
    'Our team reviews your submission': 'Tim kami meninjau data Anda',
    'Your information will be recorded for follow-up by PT Ekasanti Jayamulia.': 'Informasi Anda akan dicatat untuk ditindaklanjuti oleh PT Ekasanti Jayamulia.',
    'We contact you': 'Kami menghubungi Anda',
    'Further information will be communicated through the WhatsApp number you provide.': 'Informasi selanjutnya akan disampaikan melalui nomor WhatsApp yang Anda berikan.',
    'Personal Information / Informasi Pribadi': 'Informasi Pribadi',
    'Registration Form': 'Formulir Pendaftaran',
    'Required / Wajib diisi': 'Wajib diisi',
    'Please enable JavaScript to calculate your age and submit this form. / Aktifkan JavaScript untuk mengisi dan mengirim formulir.': 'Aktifkan JavaScript untuk menghitung umur dan mengirim formulir.',
    'Nama / Name': 'Nama',
    'Tempat Lahir / Birthplace': 'Tempat Lahir',
    'Tanggal Lahir / Birthday': 'Tanggal Lahir',
    'Umur / Age': 'Umur',
    'years': 'tahun',
    'Automatically calculated from birthday.': 'Dihitung otomatis dari tanggal lahir.',
    'Jenis Kelamin / Gender': 'Jenis Kelamin',
    'Pilih / Select': 'Pilih',
    'Laki-laki / Male': 'Laki-laki',
    'Perempuan / Female': 'Perempuan',
    'WhatsApp No': 'No. WhatsApp',
    'Please enter an active WhatsApp number.': 'Masukkan nomor WhatsApp yang aktif.',
    'Alamat / Address': 'Alamat',
    'Pengalaman Kerja Sebelumnya / Previous Work Experience': 'Pengalaman Kerja Sebelumnya',
    'Bidang Pekerjaan yang Diminati / Preferred Field of Work': 'Bidang Pekerjaan yang Diminati',
    'Pertanyaan / Question': 'Pertanyaan',
    'Optional': 'Opsional',
    'By submitting this form, you confirm that the information provided is accurate and may be used by PT Ekasanti Jayamulia to contact you regarding your inquiry.': 'Dengan mengirim formulir ini, Anda menyatakan bahwa informasi yang diberikan akurat dan dapat digunakan oleh PT Ekasanti Jayamulia untuk menghubungi Anda terkait pendaftaran ini.',
    'Submit Registration': 'Kirim Pendaftaran',
    'Need Help?': 'Butuh Bantuan?',
    'Chat on WhatsApp': 'Chat melalui WhatsApp',
    'Back to Homepage': 'Kembali ke Beranda'
  };

  const placeholderIdMap = {
    'Masukkan nama lengkap / Enter full name': 'Masukkan nama lengkap',
    'Contoh: Bekasi': 'Contoh: Bekasi',
    'Auto': 'Otomatis',
    'Contoh: 081234567890 / +6281234567890': 'Contoh: 081234567890 / +6281234567890',
    'Masukkan alamat lengkap / Enter full address': 'Masukkan alamat lengkap',
    'Ceritakan pengalaman kerja sebelumnya. Jika belum ada, tulis Belum ada pengalaman.': 'Ceritakan pengalaman kerja sebelumnya. Jika belum ada, tulis “Belum ada pengalaman”.',
    'Contoh: manufaktur, hospitality, atau pekerjaan rumah tangga': 'Contoh: manufaktur, hospitality, atau pekerjaan rumah tangga',
    'Tulis pertanyaan jika ada / Write your question, if any': 'Tulis pertanyaan jika ada'
  };

  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('.language-switcher')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  while (walker.nextNode()) {
    const node = walker.currentNode;
    textNodes.push({ node, en: node.nodeValue });
  }

  const fields = Array.from(document.querySelectorAll('[placeholder]')).map((el) => ({ el, en: el.getAttribute('placeholder') }));
  const switches = Array.from(document.querySelectorAll('.language-option'));

  function translateText(raw, lang) {
    if (lang === 'en') return raw;
    const leading = raw.match(/^\s*/)?.[0] || '';
    const trailing = raw.match(/\s*$/)?.[0] || '';
    const core = raw.trim();
    return leading + (idMap[core] || core) + trailing;
  }

  function applyLanguage(lang, persist = true) {
    if (!supported.includes(lang)) lang = 'en';
    document.documentElement.lang = lang;
    textNodes.forEach(({ node, en }) => { node.nodeValue = translateText(en, lang); });
    fields.forEach(({ el, en }) => { el.setAttribute('placeholder', lang === 'id' ? (placeholderIdMap[en] || en) : en); });

    switches.forEach((button) => {
      const active = button.dataset.lang === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    const onSignup = !!document.getElementById('signup-form');
    if (lang === 'id') {
      document.title = onSignup ? 'Pendaftaran | PT Ekasanti Jayamulia' : 'PT Ekasanti Jayamulia | Penempatan Tenaga Kerja Internasional';
    } else {
      document.title = onSignup ? 'Sign Up | PT Ekasanti Jayamulia' : 'PT Ekasanti Jayamulia | International Workforce Placement';
    }

    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    }
    document.dispatchEvent(new CustomEvent('ejm:languagechange', { detail: { lang } }));
  }

  switches.forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));

  let initial = 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (supported.includes(saved)) initial = saved;
  } catch (_) {}
  applyLanguage(initial, false);
})();
