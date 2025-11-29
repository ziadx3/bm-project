## نظرة عامة
- ربط الواجهة الحالية بـ Firebase (Auth + Firestore + Storage) مع أدوار: شركة، باحث عن عمل، وأدمن.
- بناء صفحات ووظائف كاملة: نشر وظائف وبرامج تدريبية، التقديم والتسجيل، ولوحات تحكم مخصصة لكل دور.
- الحفاظ على الهوية البصرية الحالية (Tailwind، الخطوط، اتجاه RTL) ومكونات التصميم القائمة.

## إعداد Firebase
- إضافة الاعتماديات: `firebase` (ويب SDK).
- إنشاء ملف تهيئة: `src/lib/firebase.ts` يفعّل: `initializeApp`, `getAuth`, `getFirestore`, `getStorage`.
- تعريف متغيرات البيئة في `.env.local`: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
- تفعيل المنتجات: Authentication (Email/Password + Google اختياري)، Firestore، Storage.

## المصادقة والأدوار
- إنشاء مزود سياق: `AuthProvider` + هوك `useAuth` لإدارة حالة المستخدم، التحميل، والخطأ.
- عند التسجيل: إنشاء وثيقة `users/{uid}` تحتوي `role` (`company` | `jobSeeker` | `admin`) وحقول الملف الشخصي.
- تعديل صفحات: `src/app/login/page.tsx` و`src/app/login/components/LoginForm.tsx` لربط بـ `signInWithEmailAndPassword`، والاستفادة من حقل `userType` لتوجيه مناسب بعد تسجيل الدخول.
- تعديل `src/app/signup/page.tsx` لربط بـ `createUserWithEmailAndPassword` وحفظ الدور في Firestore.
- توجيه حسب الدور: `/dashboard/company` للشركات، `/dashboard/seeker` للباحثين، `/dashboard/admin` للأدمن.

## نموذج البيانات (Firestore)
- `users`: { uid, role, name, email, phone, skills[], resumeUrl?, createdAt }.
- `companies`: { id, ownerUid, name, logoUrl?, about, website?, createdAt }.
- `jobs`: { id, companyId, title, description, skills[], location, type, salaryRange?, status, createdAt }.
- `trainingPrograms`: { id, companyId, title, description, skills[], startDate, endDate, capacity?, createdAt }.
- `jobApplications`: { id, jobId, seekerUid, status: 'pending'|'accepted'|'rejected', createdAt }.
- `programRegistrations`: { id, programId, seekerUid, status: 'pending'|'accepted'|'rejected', createdAt }.
- فهارس مركبة (لاحقًا إذا لزم): مثل `jobs (companyId, status)` و`jobApplications (jobId, status)`.

## قواعد أمان Firestore (مقتضبة)
- المستخدم الذي `role=company` يستطيع CRUD على `companies/{companyId}` الخاصة به، و`jobs` و`trainingPrograms` حيث `ownerUid == request.auth.uid`.
- المستخدم الذي `role=jobSeeker` يستطيع القراءة العامة لـ`jobs` و`trainingPrograms`، وكتابة `jobApplications`/`programRegistrations` الخاصة به فقط.
- الأدمن يستطيع القراءة والكتابة بشكل موسّع؛ ضبطه عبر حقل `role='admin'` في `users`.
- رفض أي تعديل يتجاوز صلاحيات الدور.

## الصفحات والتوجيه
- إضافة مسارات:
  - `/jobs`: قائمة الوظائف + فلترة حسب المهارات والموقع؛ صفحة تفاصيل `/jobs/[id]`.
  - `/programs`: قائمة البرامج التدريبية؛ تفاصيل `/programs/[id]`.
  - `/dashboard/company`: إدارة الشركة، نشر/تعديل/حذف الوظائف والبرامج، واستعراض الطلبات/التسجيلات.
  - `/dashboard/seeker`: ملف شخصي، إدارة الطلبات والتسجيلات، وحفظ الوظائف.
  - `/dashboard/admin`: مؤشرات وإحصائيات ومراجعة المحتوى.
- حراسة المسارات على العميل: مكوّن `RequireAuth` يتحقق من `auth.currentUser` والدور؛ يعيد التوجيه إلى `/login` أو الصفحة المناسبة.

## المكونات والواجهات
- نماذج Tailwind متسقة مع التصميم الحالي:
  - `JobForm`, `ProgramForm`, `CompanyProfileForm`, `SeekerProfileForm`.
  - بطاقات عرض: `JobCard`, `ProgramCard`, مع حالات تحميل وخطأ.
- إعادة استخدام مكونات موجودة: `navbar`, `hero`, `features`, `ourclients`, `contactus`, و`footer`؛ إضافة روابط إلى `/jobs` و`/programs` بدل مراسي داخلية.

## تخزين الوسائط (Storage)
- رفع شعار الشركة وصور البرامج إلى مسارات آمنة: `companies/{companyId}/logo.png`, `programs/{programId}/cover.*`.
- توليد روابط تحميل آمنة عبر قواعد Storage مرتبطة بالدور.

## هوكات وعمليات CRUD
- `useJobs`: إنشاء/تحديث/حذف/جلب وظائف + فلترة.
- `usePrograms`: CRUD للبرامج التدريبية.
- `useApplications`: تقديم، تحديث الحالة، وجلب الطلبات حسب الشركة أو الباحث.
- إدارة حالة التحميل والأخطاء وإشعارات واجهة مبسطة.

## لوحة الإدارة
- بطاقات مؤشرات: عدد الشركات، الوظائف، البرامج، الطلبات، التسجيلات.
- جداول مراجعة سريعة مع إمكان تغيير الحالة أو الحذف (صلاحيات أدمن).

## الجودة والاختبار
- اختبارات وحدة أساسية للهوكات (محاكاة Firestore باستخدام طبقة تجريد).
- سيناريوهات تحقق يدوية:
  1) شركة تسجّل وتنشر وظيفة.
  2) باحث ينشئ حسابًا ويقدّم على وظيفة.
  3) تسجيل في برنامج تدريبي.
  4) التأكد من رفض عمليات غير مصرح بها بقواعد Firestore.

## الالتزام بالهوية البصرية
- الحفاظ على Tailwind والفونت والاتجاه كما هو في `src/app/layout.tsx`.
- الواجهات باللغة العربية ومتسقة مع أنماط المكونات الحالية.

## متطلبات التنفيذ
- تزويدي بمفاتيح مشروع Firebase (أو إنشاؤه)، وتحديد إن أردت مزود تسجيل اجتماعي.

## التسليم
- إضافة الملفات والمسارات المذكورة، ربط الواجهات بـ Firebase، تعليمات تشغيل محلية.

هل ترغب بالموافقة على هذا الخطة لبدء التنفيذ؟