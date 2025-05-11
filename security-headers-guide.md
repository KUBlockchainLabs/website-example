# คู่มือการใช้ HTTP Security Headers ใน Next.js

HTTP Security Headers เป็นกลไกสำคัญในการปกป้องเว็บแอปพลิเคชันจากการโจมตีในรูปแบบต่างๆ การกำหนดค่าเหล่านี้ใน Next.js สามารถทำได้ผ่านการตั้งค่าในไฟล์ `next.config.js` ดังตัวอย่าง:

```javascript
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'",
        },
      ],
    },
  ];
}
```

## 1. X-Content-Type-Options

### อธิบาย
ป้องกันการ MIME-type sniffing ซึ่งเป็นช่องโหว่ที่เบราว์เซอร์พยายามคาดเดาประเภทของไฟล์แทนที่จะเชื่อถือ Content-Type header ที่เซิร์ฟเวอร์ส่งมา

### ค่าที่เป็นไปได้
- `nosniff` (เป็นค่าเดียวที่มี) - บังคับให้เบราว์เซอร์ไม่ทำการ sniffing และใช้ Content-Type ที่เซิร์ฟเวอร์ส่งมาเท่านั้น

### ประโยชน์
- ป้องกันการโจมตีแบบ XSS ที่อาศัยการหลอกให้เบราว์เซอร์ตีความไฟล์ผิดประเภท
- ป้องกันเบราว์เซอร์จากการตีความไฟล์ที่อัปโหลดโดยผู้ใช้ผิดประเภท

## 2. X-Frame-Options

### อธิบาย
ควบคุมว่าเว็บของคุณสามารถถูกใส่ในเฟรม (iframe) ของเว็บอื่นได้หรือไม่

### ค่าที่เป็นไปได้
- `DENY` - ไม่อนุญาตให้ใส่เว็บของคุณในเฟรมใดๆ เลย
- `SAMEORIGIN` - อนุญาตเฉพาะเว็บที่มาจากโดเมนเดียวกัน
- `ALLOW-FROM uri` - อนุญาตเฉพาะ URI ที่ระบุ (ค่านี้เริ่มเลิกใช้แล้ว ควรใช้ CSP frame-ancestors แทน)

### ประโยชน์
- ป้องกันการโจมตีแบบ Clickjacking ที่ผู้โจมตีซ่อนเว็บของคุณในเฟรมและหลอกให้ผู้ใช้คลิกในตำแหน่งที่ไม่ได้ตั้งใจ
- ป้องกันไม่ให้เว็บไซต์ที่ไม่น่าเชื่อถือฝังเนื้อหาของคุณ

## 3. X-XSS-Protection

### อธิบาย
ควบคุมการป้องกัน XSS ที่มีอยู่แล้วในเบราว์เซอร์สมัยใหม่

### ค่าที่เป็นไปได้
- `0` - ปิดการป้องกัน XSS
- `1` - เปิดการป้องกัน XSS
- `1; mode=block` - เปิดการป้องกัน XSS และบล็อกการเรนเดอร์หน้าเว็บหากตรวจพบการโจมตี
- `1; report=URI` - เปิดการป้องกัน XSS และรายงานไปยัง URI ที่กำหนด

### ประโยชน์
- เพิ่มการป้องกัน XSS นอกเหนือจากการป้องกันที่ควรมีในโค้ด
- ป้องกันการโจมตี XSS แบบพื้นฐาน

### หมายเหตุ
Header นี้เริ่มถูกทดแทนด้วย Content-Security-Policy ในเบราว์เซอร์สมัยใหม่ แต่ยังคงเป็นการป้องกันเพิ่มเติมสำหรับเบราว์เซอร์รุ่นเก่า

## 4. Referrer-Policy

### อธิบาย
ควบคุมข้อมูล Referrer ที่เบราว์เซอร์ส่งไปยังเว็บอื่นเมื่อมีการคลิกลิงก์หรือส่งข้อมูล

### ค่าที่เป็นไปได้
- `no-referrer` - ไม่ส่ง Referrer เลย
- `no-referrer-when-downgrade` - ส่ง URL เต็มไปยังแหล่งที่ปลอดภัยเท่าๆ กัน
- `origin` - ส่งเฉพาะโดเมนต้นทาง
- `origin-when-cross-origin` - ส่ง URL เต็มเมื่ออยู่ในโดเมนเดียวกัน, ส่งแค่โดเมนต้นทางเมื่อข้ามโดเมน
- `same-origin` - ส่ง Referrer เฉพาะเมื่ออยู่ในโดเมนเดียวกัน
- `strict-origin` - ส่งเฉพาะโดเมนต้นทางและเฉพาะไปยังแหล่งที่ปลอดภัย (HTTPS→HTTPS)
- `strict-origin-when-cross-origin` - ส่ง URL เต็มภายในโดเมนเดียวกัน, ส่งเฉพาะโดเมนต้นทางเมื่อข้ามโดเมนและต่อกับ HTTPS เท่านั้น
- `unsafe-url` - ส่ง URL เต็มเสมอ (ไม่แนะนำ)

### ประโยชน์
- ป้องกันการรั่วไหลของข้อมูลผ่าน Referrer header
- ช่วยรักษาความเป็นส่วนตัวของผู้ใช้
- ป้องกันข้อมูลที่ละเอียดอ่อนใน URL จากการรั่วไหลไปยังเว็บไซต์อื่น

## 5. Content-Security-Policy

### อธิบาย
กำหนดแหล่งที่มาของเนื้อหาต่างๆ ที่เบราว์เซอร์สามารถโหลดได้ ควบคุมแหล่งที่มาของ JavaScript, CSS, Images, Fonts ฯลฯ

### ค่าที่เป็นไปได้ (มีมากมาย)
- `default-src 'self'` - อนุญาตเฉพาะทรัพยากรจากโดเมนเดียวกับเว็บของคุณ
- ตัวอย่างการกำหนดนโยบายเฉพาะ:
  - `script-src 'self' https://cdn.example.com` - อนุญาต JavaScript จากโดเมนของตัวเองและจาก cdn.example.com
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` - อนุญาต CSS จากโดเมนของตัวเอง, CSS แบบ inline และจาก fonts.googleapis.com
  - `img-src 'self' data: https://img.example.com` - อนุญาตรูปภาพจากโดเมนของตัวเอง, ข้อมูล base64 และจาก img.example.com
  - `font-src 'self' https://fonts.gstatic.com` - อนุญาตฟอนต์จากโดเมนของตัวเองและจาก fonts.gstatic.com
  - `connect-src 'self' https://api.example.com` - อนุญาตการเชื่อมต่อ API ไปยังโดเมนของตัวเองและ api.example.com
  - `frame-src 'self' https://youtube.com` - อนุญาต iframes จากโดเมนของตัวเองและ youtube.com
  - `media-src 'self' https://media.example.com` - อนุญาตมีเดียจากโดเมนของตัวเองและ media.example.com
  - `object-src 'none'` - ไม่อนุญาตเนื้อหาประเภท object (เช่น Flash)
  - `base-uri 'self'` - จำกัด URLs ที่สามารถใช้ในแท็ก `<base>`
  - `form-action 'self'` - จำกัดการส่งแบบฟอร์มไปยังโดเมนของตัวเอง
  - `frame-ancestors 'none'` - ไม่อนุญาตให้เว็บอื่นใช้เว็บของคุณใน iframe (คล้ายกับ X-Frame-Options: DENY)

### ค่าพิเศษที่ใช้บ่อย
- `'self'` - อนุญาตเฉพาะทรัพยากรจากโดเมนเดียวกัน
- `'none'` - ไม่อนุญาตทรัพยากรใดๆ
- `'unsafe-inline'` - อนุญาต inline JavaScript และ CSS
- `'unsafe-eval'` - อนุญาตการใช้ฟังก์ชัน eval() และฟังก์ชันที่เกี่ยวข้อง
- `'nonce-{random}'` - อนุญาตรหัสที่มี nonce ตรงกับที่กำหนด
- `'sha256-{hash}'` - อนุญาตรหัสที่มี hash SHA256 ตรงกับที่กำหนด

### ประโยชน์
- เป็นการป้องกัน XSS ที่ดีที่สุด
- ควบคุมแหล่งที่มาของทรัพยากรทั้งหมด
- จำกัดผลกระทบหากมีการฝังรหัสที่เป็นอันตราย
- สามารถกำหนดนโยบายละเอียดเพื่อความปลอดภัยสูงสุด

### ตัวอย่าง CSP ที่สมบูรณ์มากขึ้น

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https://img.example.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.example.com;
```

## คำแนะนำในการใช้งาน

1. **เริ่มต้นอย่างค่อยเป็นค่อยไป**: เริ่มด้วยนโยบายที่ไม่เข้มงวดและค่อยๆ เพิ่มความเข้มงวดขึ้น
2. **ใช้โหมดรายงาน**: ทดสอบด้วย `Content-Security-Policy-Report-Only` ก่อนใช้งานจริง
3. **ตรวจสอบความเข้ากันได้**: บาง header อาจไม่รองรับในเบราว์เซอร์บางรุ่น
4. **ระวังผลกระทบ**: CSP ที่เข้มงวดเกินไปอาจทำให้บางฟีเจอร์ของเว็บไซต์ไม่ทำงาน
5. **อัปเดตอยู่เสมอ**: แนวทางการป้องกันและการโจมตีมีการเปลี่ยนแปลงอยู่เสมอ ควรติดตามมาตรฐานใหม่ๆ

## ตัวอย่างสำหรับเว็บแอปทั่วไป

### เว็บแอปที่ใช้ React/Next.js ทั่วไป

```javascript
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { 
          key: "Content-Security-Policy", 
          value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://api.yourdomain.com;" 
        },
      ],
    },
  ];
}
```

### เว็บแอปที่ใช้บริการภายนอก (Google Fonts, Analytics, CDN)

```javascript
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { 
          key: "Content-Security-Policy", 
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://www.google-analytics.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com;" 
        },
      ],
    },
  ];
}
```

## สรุป

การใช้ HTTP Security Headers อย่างเหมาะสมเป็นส่วนสำคัญของการรักษาความปลอดภัยเว็บแอปพลิเคชัน ควรปรับแต่งให้เหมาะกับความต้องการของโปรเจคของคุณ และทดสอบอย่างละเอียดก่อนนำไปใช้ในสภาพแวดล้อมการผลิต