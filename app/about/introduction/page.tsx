import Navigation from '@/components/public/navigation'
import Footer from '@/components/public/footer'

export default function AboutIntroductionPage() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-slate-950">
      <Navigation />

      <main className="news-font mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-3">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Introduction
          </span>
        </div>

        <h1 className="text-[1.8rem] font-semibold leading-[1.25] tracking-tight text-black sm:text-[2.4rem] lg:text-[3rem] dark:text-slate-100">
          चापाकोट उद्योग वाणिज्य संघ
        </h1>

        <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg">
          स्थानीय व्यापार, उद्यमशीलता र आर्थिक समृद्धिको साझा यात्रामा समर्पित संस्था
        </p>

        <div className="mt-7 h-12 w-full rounded-sm bg-slate-200/80 dark:bg-slate-800/70" />

        <article className="mt-9 space-y-6 sm:space-y-8">
          <section className="rounded-md border border-slate-300/80 bg-[#f6f7f9] p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900/75">
            <div className="space-y-5 text-[1.02rem] leading-[1.85] text-black dark:text-slate-100 sm:text-lg">
              <p>
                गण्डकी प्रदेशको स्याङ्जा जिल्लाको दक्षिण-पूर्वी भागमा अवस्थित चापाकोट नगरपालिका — रत्नापुर, कुवाकोट र चापाकोट गाउँ विकास समितिहरूको एकीकरणबाट २०७१ सालमा नगरपालिका घोषणा भई — एउटा सम्भावनापूर्ण व्यापारिक केन्द्रको रूपमा विकसित हुँदै आइरहेको छ। कालीगण्डकी नदीको किनारमा बसेको यो भूमि शालिग्राम शिलाका लागि मात्र होइन, कृषि, साना उद्योग र व्यापार वाणिज्यका लागि पनि उत्तिकै उपजाऊ छ।
              </p>
              <p>
                यसै सन्दर्भमा, स्थानीय व्यापारी तथा उद्यमीहरूको एकता, हकहित संरक्षण र व्यावसायिक वातावरणको निर्माण गर्ने उद्देश्यले विसं २०७३ सालमा चापाकोट वाणिज्य संघको स्थापना भयो। संस्थापक अध्यक्षका रूपमा श्री राजु कोइरालाज्यूको नेतृत्वमा स्थानीय व्यवसायी, उद्योगपति तथा उद्यमशील व्यक्तित्वहरू एकत्रित भई यस संस्थाको जग बसाले।
              </p>
              <p>
                नेपालमा व्यापार संघ स्थापनाको एक गौरवशाली परम्परा छ — नेपाल चेम्बर अफ कमर्स विसं २००७ (सन् १९५१) मा स्थापना भई देशकै पहिलो वाणिज्य संस्थाको रूपमा इतिहासमा दर्ज भएको छ। त्यसपछि पोखरा, बुटवल, बिराटनगर, धनगढी, धनकुटालगायत विभिन्न नगरहरूमा क्रमशः वाणिज्य संघहरूको स्थापना हुँदै गयो। चापाकोट वाणिज्य संघ पनि यही राष्ट्रिय परम्पराको एक सगर्व उत्तराधिकारी हो।
              </p>
            </div>
          </section>

          <section className="rounded-md border border-slate-300/80 bg-[#f6f7f9] p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900/75">
            <h2 className="mb-4 text-2xl font-semibold leading-tight text-black dark:text-slate-100 sm:text-3xl">उद्देश्य तथा लक्ष्य</h2>
            <p className="mb-4 text-[1.02rem] leading-[1.85] text-black dark:text-slate-100 sm:text-lg">
              चापाकोट वाणिज्य संघले स्थापनाकालदेखि नै निम्न उद्देश्यहरू आफ्नो मार्गदर्शकसिद्धान्तका रूपमा अँगालेको छ:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-[1.02rem] leading-[1.85] text-black dark:text-slate-100 sm:text-lg">
              <li>चापाकोट नगरपालिका क्षेत्रभित्रका व्यापारी तथा उद्योगीहरूको हकहित संरक्षण गर्नु</li>
              <li>स्थानीय व्यापारिक वातावरणलाई सहज, पारदर्शी र प्रतिस्पर्धी बनाउनु</li>
              <li>नगरपालिका तथा सरकारी निकायसँग समन्वय गरी व्यापार-मैत्री नीति निर्माणमा सहयोग पुर्‍याउनु</li>
              <li>साना तथा मझौला उद्यमहरूको प्रवर्द्धन गरी स्थानीय रोजगारी सिर्जना गर्नु</li>
              <li>नेपाल उद्योग वाणिज्य महासंघ (FNCCI) सँग सहकार्य गर्दै राष्ट्रिय व्यापार नीतिमा चापाकोटको आवाज पुर्‍याउनु</li>
              <li>उद्यमशीलता विकासका लागि तालिम, सेमिनार तथा जनचेतना कार्यक्रमहरू सञ्चालन गर्नु</li>
            </ul>
          </section>

      

          <section className="rounded-md border border-slate-300/80 bg-[#f6f7f9] p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900/75">
            <h2 className="mb-4 text-2xl font-semibold leading-tight text-black dark:text-slate-100 sm:text-3xl">भौगोलिक र आर्थिक सन्दर्भ</h2>
            <p className="text-[1.02rem] leading-[1.85] text-black dark:text-slate-100 sm:text-lg">
              चापाकोट नगरपालिका १२०.५९ वर्ग किलोमिटर क्षेत्रफलमा फैलिएको छ र यहाँको जनसंख्या २६,०४२ भन्दा बढी रहेको छ। २०१८ को आर्थिक जनगणना अनुसार यस नगरपालिका क्षेत्रमा ६१९ वटा व्यावसायिक प्रतिष्ठानहरू सञ्चालनमा रहेका छन्, जसमा १,८१९ जनाभन्दा बढी व्यक्तिहरू प्रत्यक्ष रोजगारमा छन्। कृषि, पशुपालन, साना उद्योग, व्यापार, होटल–पर्यटन तथा सेवा क्षेत्र यहाँका मुख्य आर्थिक गतिविधिहरू हुन्।
            </p>
          </section>

          <section className="rounded-md border border-slate-300/80 bg-[#f6f7f9] p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900/75">
            <h2 className="mb-4 text-2xl font-semibold leading-tight text-black dark:text-slate-100 sm:text-3xl">कार्यक्षेत्र तथा उपलब्धिहरू</h2>
            <p className="mb-4 text-[1.02rem] leading-[1.85] text-black dark:text-slate-100 sm:text-lg">
              स्थापनाकालदेखि नै चापाकोट वाणिज्य संघले निम्न क्षेत्रहरूमा सक्रिय योगदान पुर्‍याउँदै आएको छ:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-[1.02rem] leading-[1.85] text-black dark:text-slate-100 sm:text-lg">
              <li>सदस्यता विस्तार: स्थानीय व्यापारी, दोकानदार, उद्योगपति तथा उद्यमीहरूलाई सदस्यतामा आबद्ध गर्दै संस्थाको आधार फराकिलो बनाउने कार्य</li>
              <li>नीति वकालत: नगरपालिकासँग समन्वय गरी करनीति, इजाजतपत्र प्रक्रिया र पूर्वाधार विकासमा व्यापारी समुदायको पक्षमा आवाज उठाउने कार्य</li>
              <li>सक्षमता विकास: व्यवसाय सञ्चालन, लेखाप्रणाली, कर व्यवस्थापन र उद्यमशीलता विकाससम्बन्धी तालिम तथा अभिमुखीकरण कार्यक्रमहरूको आयोजना</li>
              <li>बजार व्यवस्थापन: चाडपर्वका समयमा उपभोग्य वस्तुको मूल्य स्थिरता र आपूर्ति सुनिश्चितताका लागि नगरपालिकासँग समन्वय</li>
              <li>सामाजिक उत्तरदायित्व: स्थानीय विकास निर्माण, शिक्षा तथा स्वास्थ्य क्षेत्रमा सहयोग पुर्‍याउने जनकल्याणकारी कार्यहरू</li>
            </ul>
          </section>

          <section className="rounded-md border border-slate-300/80 bg-[#f6f7f9] p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900/75">
            <h2 className="mb-4 text-2xl font-semibold leading-tight text-black dark:text-slate-100 sm:text-3xl">भविष्यको दिशा</h2>
            <p className="text-[1.02rem] leading-[1.85] text-black dark:text-slate-100 sm:text-lg">
              नेपालको संघीय संरचना अनुसार स्थानीय सरकारहरू थप सशक्त बन्दै जाँदा, चापाकोट वाणिज्य संघको भूमिका पनि उत्तरोत्तर विस्तार हुँदै जाने विश्वास गरिन्छ। डिजिटल अर्थतन्त्र, कृषि-व्यवसाय, पर्यटन र साना उद्योगका क्षेत्रमा नयाँ अवसरहरूको खोजी गर्दै, चापाकोट वाणिज्य संघले यस क्षेत्रलाई आर्थिक समृद्धितर्फ डोर्‍याउने दृढ संकल्प राखेको छ। स्थानीय उत्पादनको ब्रान्डिङ, बजार पहुँच विस्तार र लगानी आकर्षण गर्ने कार्यमा संस्था निरन्तर प्रयासरत रहनेछ।
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
