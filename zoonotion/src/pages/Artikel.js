import React, {useState, useEffect} from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Artikel.css'; 
import { FiArrowRight } from 'react-icons/fi';

function Artikel(){
  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    const defaultArticleList = [
      {
        id: 1,
        title: 'Musang Pandan: Ciri-ciri, Karakteristik dan Fakta Menariknya',
        description: 'Pernah dengar tentang musang pandan? Binatang yang satu ini mungkin masih jarang terdengar, namun ternyata hewan ini punya ciri-ciri dan karakteristik unik yang bikin kamu penasaran. Dengan tubuh yang ramping dan bulu yang khas, hewan yang satu ini memiliki banyak fakta menarik yang nggak kalah seru untuk dibahas. Kalau kamu ingin tahu lebih dalam tentang musang pandan, mulai dari penampilannya sampai kebiasaan hidupnya, yuk simak artikel ini!',
        imageUrl: '/assets/gambarMusang.webp',
        author: 'Laila', 
        publishDate: '2025',
        bannerImage: '/assets/bannerKupu.png',
        fullDescription: `Pernah dengar tentang musang pandan? Binatang yang satu ini mungkin masih jarang terdengar, namun ternyata hewan ini punya ciri-ciri dan karakteristik unik yang bikin kamu penasaran. Dengan tubuh yang ramping dan bulu yang khas, hewan yang satu ini memiliki banyak fakta menarik yang nggak kalah seru untuk dibahas. Kalau kamu ingin tahu lebih dalam tentang musang pandan, mulai dari penampilannya sampai kebiasaan hidupnya, yuk simak artikel ini!

        Musang pandan (Paradoxurus hermaphroditus) adalah salah satu spesies musang yang berasal dari kawasan Asia Tenggara. Hewan ini bisa ditemukan di berbagai negara, termasuk Indonesia. Musang pandan memiliki ciri-ciri fisik yang unik, seperti tubuh yang ramping, bulu berwarna cokelat keabu-abuan, dan ekor panjang bergaris. Musang pandan juga dikenal dengan aroma khasnya yang mirip dengan bau pandan, itulah mengapa dinamakan musang pandan.

        Di Indonesia, hewan ini dikenal dengan berbagai nama lokal, seperti "luwak pandan" atau "musang luwak". Mereka lebih sering ditemukan di daerah-daerah dengan iklim tropis dan keberadaan sungai yang mendukung habitatnya. Musang pandan adalah hewan nokturnal yang aktif mencari makan di malam hari. Mereka sering bersembunyi di pohon, lubang tanah, atau gua di siang hari.

        Berikut beberapa ciri-ciri musang pandan:
        1. Tubuh Ramping dan Panjang: Musang pandan memiliki tubuh yang ramping dengan panjang sekitar 40 hingga 60 cm (tidak termasuk ekor). Ekornya panjang, sekitar 30 hingga 50 cm, dan bergaris-garis hitam dan putih.
        2. Bulu Cokelat Keabu-abuan: Bulu musang pandan berwarna cokelat keabu-abuan dengan beberapa variasi warna, seperti cokelat muda atau cokelat tua. Beberapa musang pandan memiliki bercak-bercak gelap di bagian perut.
        3. Gigi Tajam dan Cakar Kuat: Musang pandan memiliki gigi yang tajam dan kuat, berguna untuk memakan buah-buahan, serangga, dan hewan kecil. Cakarnya yang kuat membantu mereka memanjat pohon dan berpegangan erat pada dahan.
        4. Bau Pandan: Musang pandan memiliki kelenjar bau yang mengeluarkan aroma khas pandan. Aroma ini digunakan untuk menandai wilayah dan berkomunikasi dengan sesama musang pandan.
        5. Karnivora dan Omnivora: Musang pandan adalah hewan omnivora yang memakan buah-buahan, serangga, telur, dan hewan kecil lainnya. Mereka sering mencari makan di sekitar pemukiman manusia, seperti kebun dan ladang.
        6. Hewan Nokturnal: Musang pandan adalah hewan nokturnal yang aktif di malam hari. Mereka bersembunyi di siang hari dan keluar mencari makan di malam hari.
        7. Pemanjat Pohon: Musang pandan adalah pemanjat pohon yang ulung. Mereka sering bersembunyi di pohon dan menggunakan ekornya untuk menjaga keseimbangan.

        Fakta Menarik tentang Musang Pandan:
        1. Kopi Luwak: Musang pandan dikenal sebagai produsen kopi luwak. Mereka memakan biji kopi, yang kemudian difermentasi di dalam saluran pencernaan mereka. Biji kopi yang telah melewati pencernaan musang pandan dianggap memiliki cita rasa yang unik dan mahal.
        2. Peran Ekologis: Musang pandan memiliki peran penting dalam ekosistem sebagai penyebar biji tumbuhan. Mereka membantu menyebarkan biji buah-buahan yang mereka makan, sehingga membantu menjaga keseimbangan alam.
        3. Populasi: Musang pandan dapat ditemukan di berbagai habitat, seperti hutan, perkebunan, dan daerah perkotaan. Mereka beradaptasi dengan baik di berbagai lingkungan dan populasinya cukup stabil.

        Itulah beberapa informasi menarik tentang musang pandan. Hewan ini memiliki ciri-ciri unik dan berperan penting dalam ekosistem. Jika Anda tertarik untuk mempelajari lebih lanjut tentang musang pandan, kunjungi kebun binatang terdekat atau cari informasi lebih lanjut di internet.
        `,
      },
      {
        id: 2,
        title: 'Kucing Siam: Mengenal si Kucing Pintar yang Menggemaskan!',
        description: 'Kucing siam atau siamese merupakan salah satu ras kucing hias yang umum dipelihara di seluruh dunia. Kucing yang memiliki perawakan layaknya kucing domestik ini dinamakan siam karena berasal dari Negara Siam yang sekarang lebih dikenal dengan nama Thailand.',
        imageUrl: '/assets/gambarKucing.webp',
        author: 'Novi Veronika',
        publishDate: '2025',
        bannerImage: '/assets/bannerKupu.png',
        fullDescription: `Kucing siam atau siamese merupakan salah satu ras kucing hias yang umum dipelihara di seluruh dunia. Kucing yang memiliki perawakan layaknya kucing domestik ini dinamakan siam karena berasal dari Negara Siam yang sekarang lebih dikenal dengan nama Thailand.

          Meski termasuk dalam kategori ras kucing populer, ironisnya populasi kucing siam di alam tempat tinggal aslinya semakin berkurang. Meski begitu, sebagian orang yang peduli sudah mulai melakukan menjaga populasinya supaya ras kucing ini tidak punah.

          Secara umum kucing siam memiliki kepribadian yang hampir sama dengan kucing anggora. Meski begitu, terdapat beberapa jenis siamese yang tak direkomendasikan untuk dipelihara karena sikapnya terlalu rumit dan sulit beradaptasi sehingga lebih berisiko mengalami sakit yang berujung pada kematian.

          Kendati demikian, jika Grameds memiliki keinginan untuk memelihara jenis kucing ini tidak ada salahnya untuk memahami sifat dan karakter alaminya terlebih dahulu. Kucing siam merupakan salah satu jenis kucing yang memiliki tingkat kecerdasan tinggi, lincah, aktif, dan gemar bermain.

          Siam adalah salah satu ras kucing yang mudah beradaptasi, sehingga tak mengherankan jika kucing ini akan sering mengajak bermain bersama. Kucing siam juga memiliki sifat keras kepala, jika keinginannya tak segera terpenuhi, ia akan marah, mengeluarkan suara yang keras, serta cukup sulit untuk dihentikan.

          Oleh sebab itu, kucing ini tidak dapat Grameds tinggal sendirian di rumah dalam waktu yang lama karena ia selalu memerlukan perhatian yang lebih dari majikannya.

          Jenis Kucing Siam
          Berdasarkan karakteristiknya, kucing siam bisa dibedakan menjadi beberapa jenis, antara lain:
          Traditional Siamese Cat
          Apabila dibandingkan dengan jenis kucing siam lainnya, Traditional Siamese Cat adalah kucing yang memiliki ukuran paling besar. Tulang wajah serta pipinya lebar, tetapi pada bagian pipinya tampak cekung.

          Warna tubuh jenis ini tidak memiliki banyak berbeda dengan jenis siam lainnya, yakni perpaduan antara warna putih pucat dengan cokelat gelap. Walaupun memiliki pipi besar, kucing ini juga memiliki bentuk hidung yang runcing dan tinggi.
          Classic Siamese Cat
          Sekilas, Classic Siamese Cat memiliki penampilan yang mirip dengan kucing siamese tradisional, tetapi perawakannya lebih kecil. Bentuk wajahnya berbentuk seperti segitiga dengan ukuran pipi yang kecil. Sayangnya, kucing ini memiliki usia hidup yang cenderung rendah, yakni maksimal hanya 5 tahun. Selain itu, classic siamese cat dapat dikatakan sebagai jenis yang cukup sulit untuk dijadikan sebagai hewan peliharaan sehingga kurang populer di kalangan masyarakat.
          Modern Siamese Cat
          Modern Siamese Cat atau juga populer dengan nama Lynx adalah ras siamese yang memiliki ukuran tubuh paling ramping. Julukan Lynx diperoleh dari sebuah rasi bintang yang mempunyai simbol menyerupai kucing. Kucing siam modern memiliki berat sekitar 5 kg hingga 7 kg dengan warna bulu didominasi putih, tetapi bulu wajahnya berwarna cokelat muda.
          Applehead Siamese Cat
          Kucing ini disebut dengan Applehead karena memiliki bentuk kepala yang serupa dengan buah apel. Bila diperhatikan dengan lebih detail, Applehead Siamese Cat memiliki banyak persamaan dengan kucing siam tradisional, tetapi bentuk kepalanya berbeda. Perbedaan lainnya juga terdapat pada bentuk tubuhnya yang cenderung lebih berotot.
        `,
      },
      {
        id: 3,
        title: 'Kenali 100 Nama Hewan di Indonesia yang Menakjubkan!',
        description: 'Tahukah kamu? Indonesia dikenal sebagai salah satu negara yang kaya akan sumber daya hayati terbesar di dunia. Mulai dari mamalia megah seperti harimau Sumatra sampai serangga kumbang tanduk, masing-masing daerah di negara ini punya kekayaan fauna yang luar biasa.',
        imageUrl: '/assets/gambarSinga.png',
        author: 'Laila',
        publishDate: '2025',
        bannerImage: '/assets/bannerKupu.png',
        fullDescription: `Tahukah kamu? Indonesia dikenal sebagai salah satu negara yang kaya akan sumber daya hayati terbesar di dunia. Mulai dari mamalia megah seperti harimau Sumatra sampai serangga kumbang tanduk, masing-masing daerah di negara ini punya kekayaan fauna yang luar biasa.

        Nah, untuk mengenal mereka lebih dekat, berikut Gramin sertakan 100 nama hewan di Indonesia beserta nama ilmiahnya. Bahkan, kamu juga akan mempelajari betapa pentingnya pelestarian fauna untuk menjaga keseimbangan ekosistem tropis Indonesia!

        Aturan Penamaan Hewan Secara Ilmiah
        Setiap nama ilmiah hewan ditetapkan berdasarkan aturan International Code of Zoological Nomenclature (ICZN), sebuah sistem internasional yang menjaga penamaan hewan di seluruh dunia tetap konsisten.
        Dalam nama ilmiah hewan, kamu akan menemukan dua kata dalam bahasa Latin atau yang dilatinkan, dan dikenal sebagai binomial nomenclature.

        Pentingnya Nama Ilmiah Hewan
        Kira-kira, kenapa setiap hewan ini punya nama ilmiah, ya? Berikut adalah beberapa alasan yang mendasari jawaban atas pertanyaan tersebut!

        Menghindari Kebingungan
        Nama ilmiah berperan sebagai nama universal yang efektif untuk mengidentifikasi hewan, terlepas dari bahasa lokal atau sebutan daerahnya. Misalnya, buaya dalam bahasa Indonesia akan dikenal sebagai Crocodylus porosus di tempat lainnya.

        Memudahkan Penelitian dan Kolaborasi
        Dengan adanya nama ilmiah, para peneliti dari berbagai negara bisa merujuk pada spesies yang sama tanpa ambiguitas. Ini sangat penting untuk studi ekologi, konservasi, dan biologi evolusi.
        Mengungkap Hubungan Evolusi
        Nama ilmiah mencerminkan hubungan genetis dan evolusi antarspesies. Misalnya saja, hewan yang tergabung genus Panthera antara lain adalah harimau, singa, macan tutul, dan jaguar. Dalam kata lain, mereka berasal dari satu jenis nenek moyang yang sama!
        Mendukung Upaya Konservasi
        Dengan melakukan identifikasi yang jelas, lembaga yang berwajib dapat fokus melindungi spesies yang terancam punah, misalnya saja seperti Rhinoceros sondaicus (Badak Jawa).

        Upaya Konservasi Hewan di Indonesia
        Indonesia adalah rumah bagi berbagai spesies hewan yang unik. Sayangnya, beberapa dari mereka terancam punah sehingga kita perlu membudidayakan upaya konservasi. Inilah beberapa aspek utama dari konservasi hewan di Indonesia:

        Penyebab Ancaman terhadap Hewan
        Banyak spesies hewan di Indonesia yang terancam karena sesuatu, seperti deforestasi, perburuan ilegal, sampai perubahan iklim. Hal tersebut tentu sangat mengganggu ekosistem dan siklus hidup mereka.
        Spesies Terancam Punah
        Beberapa hewan yang paling terancam punah di Indonesia antara lain Orangutan Sumatra dan Kalimantan, Harimau Sumatra, dan Badak Jawa. Ketiganya terancam antara lain karena ulah perburuan liar, hilangnya habitat, populasinya yang semakin terbatas.
        Upaya Konservasi
        Untuk melindungi keanekaragaman hayati ini, pemerintah setempat sudah mengupayakan berbagai jenis konservasi. Mulai dari mendirikan Taman Nasional dan Cagar Alam, program breeding captive, dan mengedukasi serta mengajak masyarakat untuk terlibat dalam konservasi tersebut.
        Kerja Sama Internasional
        Indonesia bekerja sama dengan berbagai organisasi internasional untuk melindungi spesies yang terancam punah. Ini termasuk World Wildlife Fund (WWF) dan International Union for Conservation of Nature (IUCN).
        Tantangan dalam Konservasi
        Meskipun berbagai upaya telah dilakukan, masih ada banyak tantangan yang dihadapi dalam konservasi hewan di Indonesia, seperti dana yang masih sangat terbatas dan penegakan hukum.
        `,
      },
      {
        id: 4,
        title: 'Inilah 8 Spesies Ular Terbesar di Dunia, Salah Satunya Ada Black Mamba',
        description: 'Tak jarang berita tentang penemuan ular besar di sekitar kawasan rumah warga beredar, penemuan ular besar ini tentunya menghebohkan karena masyarakat khawatir bahwa ular tersebut dapat membahayakan manusia maupun hewan peliharaan. Di Indonesia, ular paling besar adalah Anaconda Hijau dengan panjang mencapai 9,7 m dan berat lebih dari 249 kg! Tetapi selain Anaconda Hijau, ada beberapa spesies ular terbesar lain di dunia lho!',
        imageUrl: '/assets/gambarUlar.webp',
        author: 'Ratih',
        publishDate: '2025',
        bannerImage: '/assets/bannerKupu.png',
        fullDescription: `Ular terbesar di dunia – Tak jarang berita tentang penemuan ular besar di sekitar kawasan rumah warga beredar, penemuan ular besar ini tentunya menghebohkan karena masyarakat khawatir bahwa ular tersebut dapat membahayakan manusia maupun hewan peliharaan. Di Indonesia, ular paling besar adalah Anaconda Hijau dengan panjang mencapai 9,7 m dan berat lebih dari 249 kg! Tetapi selain Anaconda Hijau, ada beberapa spesies ular terbesar lain di dunia lho!

        Salah satu jenis ular terbesar di dunia adalah Black Mamba dengan berat mencapai 1,3 kg. Selain Black Mamba jenis ular lain dengan ukuran besar adalah Anaconda dan King  Cobra. Penasaran dengan jenis-jenis ular terbesar di dunia? Simak daftar spesies ular terbesar di dunia satu ini. Simak hingga akhir artikel ya!

        Dikutip dari Kompas.com, ada sekitar 3000 spesies ular yang saat ini tercatat berada di bumi mulai dari bagian Amerika Selatan, African bahkan hingga di sekitar daerah Asia Tenggara. Dari 3000 spesies ular tersebut, sekitar 600 spesies ular termasuk ular dengan bisa dan 200 spesies ular lainnya diketahui mampu melukai serta dapat membunuh manusia secara signifikan.

        Tak hanya berbisa, sebagian dari spesies ular yang masih berada di alam liar saat ini diketahui mampu tumbuh dengan ukuran yang sangat besar dan bahkan dapat dibilang sebagai raksasa. Dikarenakan berat dan panjang tubuh ular yang sangat besar ini, beberapa spesies ular berbadan besar memiliki kemampuan untuk dapat melumpuhkan serta menemukan mangsa dengan cara melilitnya sebelum akhirnya dilahap.

        Mulga
        Jenis ular terbesar di dunia yang pertama adalah mulga atau Pseudechis australis dalam bahasa Inggris, ular satu ini dikenal pula dengan nama King brown. Ahli zoologi Inggris bernama John Edward Gray adalah tokoh yang memperkenalkan mulga untuk pertama kalinya di tahun 1842. Ia melakukan deskripsi berdasarkan spesimen yang dikumpulkannya di Port Essington, Australia Utara.

        Mulga termasuk spesies ular Elapidae yang cukup mematikan dan tersebar di sekitar Australia, tetapi ular mulga juga dapat ditemui di habitat yang lainnya. Warna dari tubuh mulga diketahui berwarna coklat dan termasuk ular berbisa.

        Ular coklat satu ini merupakan salah satu spesies ular berbisa terbesar dan terpanjang di Australia. Ular ini seringkali memiliki ukuran tubuh yang melebihi ular taipan pesisir (O. scutellatus). Panjang tubuh mulga bisa mencapai 2 hingga 2,5 meter dengan berat antara 3 hingga 6 kg. Ular mulga jantan biasanya memiliki ukuran yang lebih besar dibandingkan dengan ular betina.

        Menurut Wikipedia.com, spesimen mulga terpanjang yang pernah ditemukan adalah dengan ukuran panjang tubuh mencapai 3,3 meter. Mulga adalah ular yang memiliki tubuh kuat dengan kepala sedikit lebih lebar daripada tubuhnya. Ular ini memiliki pipi yang menonjol, mata kecil dengan iris berwarna merah kecoklatan dan lidah berwarna gelap.

        Sisik-sisik pada bagian atas tubuh, sisi badan, dan ekor mulga memiliki warna dasar kuning pucat atau kehijauan. Corak sisik ini dapat bervariasi, mulai dari warna sawo matang atau tembaga, hingga corak coklat dengan warna yang lebih pucat hingga kehitaman di bagian belakang tubuhnya.

        Pola pewarnaan ini membentuk motif berjaring-jaring pada tubuhnya. Kadang-kadang, ekor mulga memiliki warna yang lebih gelap, sementara bagian atas tubuhnya memiliki warna yang sama dengan sisi badan. Bagian bawah dari tubuh ular mulga memiliki warna krim, putih, atau bahkan salmon, kadang-kadang ada pula mulga yang memiliki corak berwarna sedikit oranye.
        `,
      },
    ];
    setArticleList(defaultArticleList);
  }, []);

  return (
    <div className="article-page">
      <div className="article-banner-container">
        <img src="/assets/bannerKupu.png" alt="Halaman Artikel" className="article-banner-image" />
        <h2 className="article-banner-text">Halaman Artikel</h2>
      </div>

      <Container className="py-5">
        <h2 className="text-center mb-4 section-title">Daftar Artikel</h2>
        <Row className="justify-content-center">
          {articleList.length > 0 ? (
            articleList.map((article) => (
              <Col md={6} className="mb-4" key={article.id}>
                <Card className="article-card bg-green-dark text-white shadow">
                  <Card.Img variant="top" src={article.imageUrl} alt={article.title} className="article-image" />
                  <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title className="text-center mb-3">{article.title}</Card.Title>
                    <Card.Text className="text-center mb-3">{article.description.substring(0, 150)}...</Card.Text>
                    <Button
                      variant="outline-light"
                      size="sm"
                      as={Link} 
                      to={`/detail-artikel/${article.id}`} 
                      className="custom-button read-more-button"
                    >
                      Lihat Selengkapnya <FiArrowRight className="arrow-icon" />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col md={12}>
              <p className="text-center">Artikel belum tersedia.</p>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Artikel;