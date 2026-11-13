import type { SceneMeta } from '../types';

export const chhathScenes: readonly SceneMeta[] = [
  {
    id: 'nahay-khay',
    numberHi: '०१',
    number: '01',
    titleHi: 'नहाय-खाय',
    titleEn: 'Nahay Khay',
    dayHi: 'पहला दिन',
    dayEn: 'Day One',
    narrationHi:
      'छठ महापर्व का शुभारंभ नहाय-खाय से होता है। यह दिन पवित्रता, स्वच्छता और सात्विकता का प्रतीक है।',
    subtitleEn:
      'The great festival of Chhath begins with Nahay Khay — a day that stands for purity, cleanliness and sattvic living.',
    altHi:
      'सुबह का बिहारी गाँव: उगता सूरज, उड़ते पक्षी, तालाब में पवित्र स्नान करती व्रती, आँगन की सफ़ाई और मिट्टी के चूल्हे पर लौकी-चना दाल व अरवा चावल बनाता परिवार।',
    durationMs: 36000,
    ground: '#3f5a2a',
    accent: '#ffd166',
    mood: 'dawn',
  },
  {
    id: 'kharna',
    numberHi: '०२',
    number: '02',
    titleHi: 'खरना',
    titleEn: 'Kharna',
    dayHi: 'दूसरा दिन',
    dayEn: 'Day Two',
    narrationHi:
      'खरना के दिन व्रती दिनभर उपवास रखते हैं और संध्या में गुड़ की खीर तथा रोटी का प्रसाद ग्रहण करते हैं।',
    subtitleEn:
      'On Kharna the devotee fasts all day and, at dusk, accepts the prasad of jaggery kheer and roti.',
    altHi:
      'शाम की रसोई: ढलता सूरज, मिट्टी का चूल्हा, जलती लकड़ी, गुड़ की खीर और रोटी बनती हुई, खरना पूजा करती व्रती और परिवार में प्रसाद का वितरण।',
    durationMs: 38000,
    ground: '#4a2c1a',
    accent: '#ff9f43',
    mood: 'dusk',
  },
  {
    id: 'sandhya-arghya',
    numberHi: '०३',
    number: '03',
    titleHi: 'संध्या अर्घ्य',
    titleEn: 'Sandhya Arghya',
    dayHi: 'तीसरा दिन',
    dayEn: 'Day Three',
    narrationHi:
      'अस्ताचलगामी सूर्य को अर्घ्य देकर हम प्रकृति और जीवन के प्रति अपनी कृतज्ञता प्रकट करते हैं।',
    subtitleEn:
      'By offering Arghya to the setting sun, we express our gratitude to nature and to life itself.',
    altHi:
      'सूर्यास्त के समय बिहार का विशाल नदी-घाट: नारंगी सूरज, नदी में खड़े सैकड़ों श्रद्धालु, सूप-दौरा में ठेकुआ व फल, अर्घ्य का जल, तैरते दीये और रात में गन्ने के मंडप वाली कोसी।',
    durationMs: 48000,
    ground: '#2a1a24',
    accent: '#ff8a1f',
    mood: 'ghat',
  },
  {
    id: 'usha-arghya',
    numberHi: '०४',
    number: '04',
    titleHi: 'उषा अर्घ्य',
    titleEn: 'Usha Arghya',
    dayHi: 'चौथा दिन',
    dayEn: 'Day Four',
    narrationHi:
      'उगते सूर्य को अर्घ्य देकर छठ महापर्व का समापन होता है। छठी मैया और सूर्य देव से सभी के सुख, शांति और समृद्धि की कामना की जाती है।',
    subtitleEn:
      'The festival ends with Arghya to the rising sun. We pray to Chhathi Maiya and Surya Dev for happiness, peace and prosperity for all.',
    altHi:
      'भोर का घाट: नीला आकाश नारंगी होता हुआ, तारे ओझल, क्षितिज से उगता सूरज, नदी में उगते सूर्य को अर्घ्य देती महिलाएँ, फिर ठेकुआ-कसार-रसिया का प्रसाद, पारण और परिवार का उत्सव।',
    durationMs: 50000,
    ground: '#3a2616',
    accent: '#ffe29a',
    mood: 'sunrise',
  },
] as const;

export const FINALE = {
  jai: ['जय छठी मैया 🙏', 'जय सूर्य देव ☀️'],
  blessing: 'आप सभी के जीवन में सुख, शांति, स्वास्थ्य और समृद्धि बनी रहे।',
  wish: 'छठ महापर्व की हार्दिक शुभकामनाएं।',
} as const;

export const SITE_TITLE = 'बिहार छठ महापर्व';
export const SITE_TAGLINE = 'चार पावन दिनों की एक सिनेमैटिक यात्रा';
export const SITE_TAGLINE_EN = 'A cinematic journey through four sacred days';
