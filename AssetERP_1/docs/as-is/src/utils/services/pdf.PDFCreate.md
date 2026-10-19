# utils.pdf.PDFCreate

`server/utils/pdf/PDFCreate.java`

서비스 키 `utils.pdf.PDFCreate.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `createPDF7` | 38 | - | `Apr01_Edit_ApprDoc`, `Dbm10_Tab_MakePdf` | `Apr10_StampPDF7` |
| `createInPDF7` | 43 | - | `Dcr00_Tab_ApprList` | `Apr10_StampPDF7` |
| `createTempPDF7` | 48 | - | - | `Apr10_StampPDF7` |
| `createPaySlip` | 59 | - | - | `Pay00_PDF7` |
| `createPayMonth` | 64 | - | `Pay02_Tab_List` | `Pay00_PDF7` |
| `createPayMonth10` | 69 | - | `Pay10_Tab_List` | `Pay00_PDF7` |
| `createIcs31` | 74 | - | `Ics32_Lookup_RelateAppr` | `Ics00_PDF7` |
| `createCarJournal` | 79 | - | `Car04_Tab_Journal` | `Car00_PDF7` |
| `createFeePDF` | 84 | - | `Biz20_Tab_FeeCharge` | `Biz21_PDF` |
