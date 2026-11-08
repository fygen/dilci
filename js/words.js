/**
 * 100 Temel İngilizce Kelime Listesi
 * Her nesne: no, word (İngilizce), meaning (Türkçe Anlamı), example (Örnek Cümle)
 */
const INITIAL_WORDS = [
  {
    "no": 1,
    "word": "The",
    "meaning": "(Tanım belirtiyor, bir kavramın bilindik olduğunu belirtmek amacıyla kullanılıyor.)",
    "example": "The Office, the theatre"
  },
  {
    "no": 2,
    "word": "Be",
    "meaning": "Ol(mak), var olmal, bulunmak (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "Be a teacher (öğretmen ol)"
  },
  {
    "no": 3,
    "word": "To",
    "meaning": "(ismin yönelme hali) (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "To you (sana), Listen to me (beni dinle), I am happy to work here (Burada çalışmaktan mutluyum)"
  },
  {
    "no": 4,
    "word": "Of",
    "meaning": "-li, -e yönelik, ilişkili, bağlantılı (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "First of all (ilk olarak), Department of Finance (Finans Bölümü), Out of (dışında)"
  },
  {
    "no": 5,
    "word": "And",
    "meaning": "Ve",
    "example": "Domato and potato (domates ve patates)"
  },
  {
    "no": 6,
    "word": "A",
    "meaning": "Bir, herhangi bir, belirli bir tür veya nitelikteki",
    "example": "A mouse (bir fare), Have a bath (banyo yapmak), a little bit (azıcık)"
  },
  {
    "no": 7,
    "word": "In",
    "meaning": "İçeri, iç, içinde (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "Get in the car (arabanın içine bin, arabaya bin), in general (genellikle), built-in (gömme, ankastre, iç yapıya dahil)"
  },
  {
    "no": 8,
    "word": "That",
    "meaning": "Şu, o (mesafe belirtiyor, uzaktaki kavramlar için kullanılıyor)",
    "example": "That is a chair. (şu bir sandalyedir.), that place (orası, ora, şurası, şura)"
  },
  {
    "no": 9,
    "word": "Have",
    "meaning": "Sahip olmak, elinde tutmak, yapmak (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "I have a car. (Arabam var.), have a nap (kestirmek), have mercy (acımak)"
  },
  {
    "no": 10,
    "word": "I",
    "meaning": "Ben",
    "example": "I am a student. (Ben bir öğrenciyim.)"
  },
  {
    "no": 11,
    "word": "It",
    "meaning": "O, ona",
    "example": "It is a pencil. (O bir kalem.)"
  },
  {
    "no": 12,
    "word": "For",
    "meaning": "İçin, yönünden, dair (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "For you (senin için), Look for (aramak), for now (şimdilik)"
  },
  {
    "no": 13,
    "word": "Not",
    "meaning": "Yok, değil, olumsuzluk, haricinde (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "It is not a monster. (O bir canavar değil.), not like yours (seninki/sizinki gibi değil)"
  },
  {
    "no": 14,
    "word": "On",
    "meaning": "Üzerinde, hazır, çalışır (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "It is a apple on the table. (Masanın üzerinde elma var.), turn on (açmak)"
  },
  {
    "no": 15,
    "word": "With",
    "meaning": "İle, birlikte, nedeniyle (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "With her (onunla), with glory (gururla)"
  },
  {
    "no": 16,
    "word": "He",
    "meaning": "O (erkekler için kullanılıyor)",
    "example": "He is a a teacher. (O bir öğretmen [ve onun erkek olduğunu anlıyoruz].)"
  },
  {
    "no": 17,
    "word": "As",
    "meaning": "Olarak, gibi, kadar (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "As a whole (bütün olarak), as soon as possible (bir an önce), as a result (sonuç olarak)"
  },
  {
    "no": 18,
    "word": "You",
    "meaning": "Sen,siz, sana, size (vb. diğer çekimler)",
    "example": "Thank you ([sana/size] + teşekkür ederim), you are a genius (sen bir dahisin)"
  },
  {
    "no": 19,
    "word": "Do",
    "meaning": "Yapmak, etmek (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "I do dishes (bulaşıkları yıkarım), do you like dolphins? (yunusları sever misin?)"
  },
  {
    "no": 20,
    "word": "At",
    "meaning": "Üzere, nezdinde, saatinde, -de (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "At 8 o’clock (Saat sekizde), at night (gece vaktinde), at work (işte)"
  },
  {
    "no": 21,
    "word": "This",
    "meaning": "Bu, buradaki",
    "example": "For this reason (bu nedenle), this desk (bu masa)"
  },
  {
    "no": 22,
    "word": "But",
    "meaning": "Ama, fakat",
    "example": "He is a good person but I don’t know him very well (o iyi biri ama onu çok tanımıyorum), last but one (sondan bir önceki)"
  },
  {
    "no": 23,
    "word": "His",
    "meaning": "Onun, ona ait (erkekler için)",
    "example": "His pencil (onun kalemi), his feelings (onun duyguları)"
  },
  {
    "no": 24,
    "word": "By",
    "meaning": "-e, -inden, tarafından, itibarıyla, boyunca (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "Stop by (uğramak), affected by something (bir şeye tutulmak), by goverment (hükümet tarafından)"
  },
  {
    "no": 25,
    "word": "From",
    "meaning": "-den, -dan, itibaren, istinaden, beri (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "Benefit from something (bir şeyden yararlanmak), apart from (haricinde), from 80’s to 2000’s (80’lerden 2000’lere)"
  },
  {
    "no": 26,
    "word": "They",
    "meaning": "Onlar (erkekler için)",
    "example": "They are actors (Onlar aktör), where are they? (onlar nerede?)"
  },
  {
    "no": 27,
    "word": "We",
    "meaning": "Biz",
    "example": "We are champions (biz şampiyonlarız), do we know each other? (birbirimizi tanıyor muyuz?)"
  },
  {
    "no": 28,
    "word": "Say",
    "meaning": "Söylemek, laflamak, demek, söz",
    "example": "Final say (son söz), say goodbye (vedalaşmak, hoşçakal demek), something to say (söyleyecek bir şey)"
  },
  {
    "no": 29,
    "word": "Her",
    "meaning": "Ona, ona it (kadınlar için kullanılıyor)",
    "example": "Mother and her daugher (anne ve kızı), her age (onun yaşı)"
  },
  {
    "no": 30,
    "word": "She",
    "meaning": "O (kadınlar için kullanılıyor)",
    "example": "She plays guitar (o gitar çalıyor)"
  },
  {
    "no": 31,
    "word": "Or",
    "meaning": "Ya da, veya",
    "example": "Burger or pizza (hamburger ya da pizza)"
  },
  {
    "no": 32,
    "word": "An",
    "meaning": "Bir (sesli harfle başlayan kelimelerin öncesinde kullanılıyor)",
    "example": "An elephant (bir fil), an office (bir ofis)"
  },
  {
    "no": 33,
    "word": "Will",
    "meaning": "Gelecek zaman kipi, irade, vasiyet (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "I will be there (orada olacağım), her will (onun vasiyeti)"
  },
  {
    "no": 34,
    "word": "My",
    "meaning": "Benim",
    "example": "My teacher (öğretmenim), my dream job (hayalimdeki meslek)"
  },
  {
    "no": 35,
    "word": "One",
    "meaning": "Bir, tek, biri",
    "example": "One by one (birer birer), one half (yarısı), little one (ufaklık, küçük biri)"
  },
  {
    "no": 36,
    "word": "All",
    "meaning": "Tüm, bütün, hepsi",
    "example": "All the time (her zaman), all creation (tüm evren), all genres (bütün türler)"
  },
  {
    "no": 37,
    "word": "Would",
    "meaning": "Koşullu dilek, -ecekti,",
    "example": "Would like (istemek), would rather (tercih etmek), If we were home he would like to come here (evde olsaydık buraya gelmek isteyecekti)"
  },
  {
    "no": 38,
    "word": "There",
    "meaning": "Ora, orada, oradaki, şura, şurada, şuradaki",
    "example": "There is a bank (orada bir banka var), get there (oraya/şuraya gitmek)"
  },
  {
    "no": 39,
    "word": "Their",
    "meaning": "Onların",
    "example": "Earn their trust (onların güvenini kazanmak), on their own (kendi kendilerine)"
  },
  {
    "no": 40,
    "word": "What",
    "meaning": "Ne, neyi, cisim,şey (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "In what follows (devamında), what is your name? (ismin(iz) ne?), what are his capabilities? (onun yetenekleri nelerdir?)"
  },
  {
    "no": 41,
    "word": "So",
    "meaning": "Böylece, bu yüzden, bu nedenle, öyle, böyle, demek ki (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "So it begins (demek ki başlıyor), I was sick so I couldn’t do homework (Hastaydım bu yüzden ödevimi yapamadım), so and so (vesaire)"
  },
  {
    "no": 42,
    "word": "Up",
    "meaning": "Yukarı, artış, çıkış, yüksekte (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "She looked up at the skies (O [yukarı doğru] gökyüzüne baktı, I wake up early (erken kalkarım), It’s up to you (sana kalmış)"
  },
  {
    "no": 43,
    "word": "Out",
    "meaning": "Çıkış, dışarıda, dış, uzakta olan (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "Get out (çık dışarı), work out (egzersiz yapmak), find out (anlamak)"
  },
  {
    "no": 44,
    "word": "If",
    "meaning": "Eğer, rağmen, sözde (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "If else (eğer başkaysa), what-if (varsayımsal), see if it works (çalışıp çalışmadığına bakmak)"
  },
  {
    "no": 45,
    "word": "About",
    "meaning": "Hakkında, dair, üzere (ayrıca başka bir çok anlamda kullanılabiliyor)",
    "example": "It is not about you (Seninle ilgili değil), moon about (dalgın dalgın durmak), the lecture is about (ders tarih hakkındadır)"
  },
  {
    "no": 46,
    "word": "Who",
    "meaning": "Kim",
    "example": "Who is there? (Orada kim var?), Who is the president of the USA (ABD’nin başkanı kimdir?) An teacher is someone who teaches to students (öğretmen öğrencilere öğreten bir kimsedir)"
  },
  {
    "no": 47,
    "word": "Get",
    "meaning": "Almak, edinmek, elde etmek, kazanmak (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "Get some supplies (Biraz malzeme al)), get trophy (kupa almak), get a job (bir meslek edin)"
  },
  {
    "no": 48,
    "word": "Which",
    "meaning": "Hangi, hangisi",
    "example": "Which day (hangi gün), which office (hangi ofis), tell which is which (hangisinin hangisi olduğunu ayırt etmek)"
  },
  {
    "no": 49,
    "word": "Go",
    "meaning": "Gitmek, çıkmak, hareket etmek, girmek, başlamak (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "He goes to school (o okula gider), I go outside (dışarıya çıkıyorum)"
  },
  {
    "no": 50,
    "word": "Me",
    "meaning": "Bende, bana, benim",
    "example": "It’s me (benim [sorulan soruya cevap verme anlamında kullanılıyor])"
  },
  {
    "no": 51,
    "word": "When",
    "meaning": "Ne zaman",
    "example": "When do we go? (ne zaman gideriz?)"
  },
  {
    "no": 52,
    "word": "make",
    "meaning": "Yapmak, etmek, sağlamak (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "I will make a cake (pasta yapacağım), make me happy (beni mutlu et)"
  },
  {
    "no": 53,
    "word": "Can",
    "meaning": "Olabilmek, yapabilmek, teneke kutu",
    "example": "I can help you (sana yardım edebilirim), it is a can (o bir teneke kutu)"
  },
  {
    "no": 54,
    "word": "Like",
    "meaning": "Sevmek, benzemek, beğenmek, hoşlanmak",
    "example": "I like pizza (pizza severim), he is not like you (o sana benzemiyor)"
  },
  {
    "no": 55,
    "word": "Time",
    "meaning": "Zaman, süre, kere",
    "example": "How many times kaç kere), it is time to sleep (uyuma zamanı), time-out (süre bitimi)"
  },
  {
    "no": 56,
    "word": "No",
    "meaning": "Hayır, yok, ret, hiç",
    "example": "I said no (hayır dedim), She voted no (O hayır oyu verdi), no way (hiç yolu yok), no one (hiç kimse)"
  },
  {
    "no": 57,
    "word": "Just",
    "meaning": "Şimdi, sadece, yalnızca, az önce, tam (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "I have just arrived (az önce geldim), it is just a squirrel (o sadece bir sincap), just now (şu anda)"
  },
  {
    "no": 58,
    "word": "Him",
    "meaning": "Ona, onu",
    "example": "Do you like him? (Ondan hoşlanıyor musun?)"
  },
  {
    "no": 59,
    "word": "Know",
    "meaning": "Bilmek, öğrenmek, tanımak",
    "example": "I know him (onu tanıyorum), she knows something (o bir şeyler biliyor)"
  },
  {
    "no": 60,
    "word": "Take",
    "meaning": "Almak, (fotoğraf) çekmek, götürmek (ayrıca başka bir çok anlamı bulunuyor)",
    "example": "I will take a shower (duş alacağım), she took some photographs (o birkaç tane fotoğraf çekti), take me home (beni eve götür)"
  },
  {
    "no": 61,
    "word": "People",
    "meaning": "İnsanlar, halk, millet",
    "example": "We are people (biz insanız), important people (önemli insanlar), common people (sıradan insanlar), crowd of people (kitle, kalabalık insan grubu)"
  },
  {
    "no": 62,
    "word": "Into",
    "meaning": "İçine, içeriye, -e, -a, -in içine",
    "example": "Into the car (arabanın içine), into the room (odanın içine)"
  },
  {
    "no": 63,
    "word": "Year",
    "meaning": "Yıl, sene, yaş",
    "example": "Happy new year (yeni yılın kutlu olsun), I am 28 years old (ben 28 yaşındayım), eventful year (olaylarla dolu sene)"
  },
  {
    "no": 64,
    "word": "Your",
    "meaning": "Senin, sizin",
    "example": "Your choice (senin/sizin seçimin([iz]), your opinion (senin/sizin düşüncen[iz])"
  },
  {
    "no": 65,
    "word": "Good",
    "meaning": "İyi, güzel, fayda",
    "example": "Good choice (iyi seçim), good luck (iyi şanslar)"
  },
  {
    "no": 66,
    "word": "Some",
    "meaning": "Biraz, bazı, birkaç (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "Some of them (bazıları), some practices (bazı uygulamalar), some ruins (bazı kalıntılar)"
  },
  {
    "no": 67,
    "word": "Could",
    "meaning": "Yapabilmek, olabilmek, “can”in geçmiş zaman hali",
    "example": "I could do it when I was younger (Gençken yapabilirdim), I could use some help (biraz yardıma ihtiyacım var)"
  },
  {
    "no": 68,
    "word": "Them",
    "meaning": "Onlara, onları",
    "example": "Don’t follow them (onları takip etme)"
  },
  {
    "no": 69,
    "word": "See",
    "meaning": "Görmek, anlamak (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "I see (görüyorum, anlıyorum), I see double (çift görüyorum)"
  },
  {
    "no": 70,
    "word": "Other",
    "meaning": "Diğer, başka, öteki",
    "example": "Other people (diğer insanlar), the other world (öteki dünya), some other time (başka zaman)"
  },
  {
    "no": 71,
    "word": "Than",
    "meaning": "-den, -e göre, hariç, nazaran (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "More than feelings (duygulardan daha fazlası), I would prefer juice rather than coke (Kolaya nazaran meyve suyunu tercih ederim)"
  },
  {
    "no": 72,
    "word": "Then",
    "meaning": "O zamanlar, o halde, öyleyse (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "Back then, I adored you (o zamanlar sana hayrandım)"
  },
  {
    "no": 73,
    "word": "Now",
    "meaning": "Şimdi, şu an, şimdiye ait",
    "example": "Right now (Hemen şimdi), he is working now (o şu an çalışıyor)"
  },
  {
    "no": 74,
    "word": "Look",
    "meaning": "Bakmak, görünmek, görünüş (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "I look into your eyes (gözlerinin içine bakıyorum), he looks handsome (yakışıklı görünüyor)"
  },
  {
    "no": 75,
    "word": "Only",
    "meaning": "Sadece, tek, sırf, yalnızca",
    "example": "Only 2 euro (sadece 2 euro), only child (tek çocuk)"
  },
  {
    "no": 76,
    "word": "Come",
    "meaning": "Gelmek (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "I come home (eve geliyorum), come to mind (akla gelmek)"
  },
  {
    "no": 77,
    "word": "Its",
    "meaning": "Onun",
    "example": "Don’t judge a book by its cover ([deyim] insanı dış görünüşüne göre yargılamayın)"
  },
  {
    "no": 78,
    "word": "Over",
    "meaning": "Fazla, bitmiş, üzerine, ötede (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "It’s over (bitti), get over something (bir şeyi atlatmak), he must be over fifty (50’nin üzerinde olmalı), a table over there (ötedeki bmasa)"
  },
  {
    "no": 79,
    "word": "Think",
    "meaning": "Düşünmek, sanmak",
    "example": "I am thinking about you (senin hakkında düşünüyorum), I think you misunderstood me (sanırım beni yanlış anladın)"
  },
  {
    "no": 80,
    "word": "Also",
    "meaning": "Ayrıca, da (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "I also called you (ayrıca seni aradım), we must also think that (şunu da düşünmeliyiz)"
  },
  {
    "no": 81,
    "word": "Back",
    "meaning": "Arka, geri (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "Turn back (geri dön)"
  },
  {
    "no": 82,
    "word": "After",
    "meaning": "Sonra, ertesi (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "Call me later (beni sonra ara), the day after (ertesi gün),"
  },
  {
    "no": 83,
    "word": "Use",
    "meaning": "Kullanmak, kullanım, faydalanmak (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "Use a notebook (dizüstü bilgisayar kullanmak), common use (genel kullanım), you used me (benden faydalandın)"
  },
  {
    "no": 84,
    "word": "Two",
    "meaning": "İki",
    "example": "Two apples (iki elma)"
  },
  {
    "no": 85,
    "word": "How",
    "meaning": "Nasıl",
    "example": "How to use (nasıl kullanılır), this story tell us how we succeeded (bu hikaye nasıl başarılı olduğumuzu anlatıyor)"
  },
  {
    "no": 86,
    "word": "Our",
    "meaning": "Bizim",
    "example": "Our team (takımımız)"
  },
  {
    "no": 87,
    "word": "Work",
    "meaning": "Çalışmak, iş, eser",
    "example": "I work as an engineer (mühendis olarak çalışıyorum), work of art (sanat eseri)"
  },
  {
    "no": 88,
    "word": "First",
    "meaning": "İlk, birinci, başlangıç (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "I come first (ilk ben geldim), first of all (herşeyden önce), first aid (ilk yardım), he was first (o birinciydi)"
  },
  {
    "no": 89,
    "word": "Well",
    "meaning": "İyi, kaynak (su vb.), kuyu (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "Do it well (iyi yap), water well (su kuyusu)"
  },
  {
    "no": 90,
    "word": "Way",
    "meaning": "Yol (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "This way goes to main street (bu yol ana caddeye gidiyor), is there any other way? (başka bir yolu var mı)"
  },
  {
    "no": 91,
    "word": "Even",
    "meaning": "Bile, hatta, çift (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "Even if you do it, our manager may not accept it (yapsan bile müdürümüz kabul etmeyebilir), you should even see it (hatta onu görmelisin), odd or even (tek mi çift mi oyunu), even number (çift rakam)"
  },
  {
    "no": 92,
    "word": "New",
    "meaning": "Yeni (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "New computer (yeni bilgisayar), new recruits (yeni elemanlar)"
  },
  {
    "no": 93,
    "word": "Want",
    "meaning": "İstemek, arzulamak",
    "example": "I want a candy (şeker istiyorum), ı want to be an engineer (mühendis olmak istiyorum, I want you (seni arzuluyorum)"
  },
  {
    "no": 94,
    "word": "Because",
    "meaning": "Çünkü (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "I can’t work today because I am sick (Bugün çalışamıyorum çünkü hastayım), because of you (senin yüzünden)"
  },
  {
    "no": 95,
    "word": "Any",
    "meaning": "Hiç, herhangi (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "Any juice left? (hiç meyve suyu kaldı mı?), you can choose any of them (Onlardan herhangi birini seçebilirsin[iz])"
  },
  {
    "no": 96,
    "word": "These",
    "meaning": "Bunlar",
    "example": "These are apple trees (bunlar elma ağaçlarıdır)"
  },
  {
    "no": 97,
    "word": "Give",
    "meaning": "Vermek, getirmek (ayrıca cümle içinde kullanımına göre başka anlamları bulunuyor)",
    "example": "Can you give me a pencil? (Bana bir kalem verebilir misin?), Give birth (doğurmak, dünyaya getirmek)"
  },
  {
    "no": 98,
    "word": "Day",
    "meaning": "Gün",
    "example": "Thursday is the 4th day of the week (perşembe haftanın 4. günüdür)"
  },
  {
    "no": 99,
    "word": "Most",
    "meaning": "En, en çok, çoğu",
    "example": "The most important (en önemli), I love him most (en çok onu seviyorum), most people (çoğu insan)"
  },
  {
    "no": 100,
    "word": "Us",
    "meaning": "Biz (ayrıca US şeklinde ABD kısaltması larak kullanılıyor)",
    "example": "He like us (O bizi sevdi), she give us a reason to quit (bize bırakmamız için bir neden veriyor)"
  }
];

if (typeof window !== 'undefined') {
  window.INITIAL_WORDS = INITIAL_WORDS;
}
