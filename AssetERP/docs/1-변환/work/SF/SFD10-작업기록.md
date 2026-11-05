# SFD10 FileDownload `view` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분석 | 원본 `viewPdf` L137-159: `contextPath + request.getParameter("url")` 경로의 파일을 `application/pdf`로 그대로 내보낸다. 없으면 "파일이 존재하지 않습니다." |
| 2026-11-04 | 호출 확인 | GWT `client/`·`webapp/`에서 `fileType=view`·`FileDownload?…view` 검색 → **호출하는 곳 없음**. PDF 화면(`PDFViewer`·`Biz11_`·`Pay08_`·`Sys95_PDFViewer`)은 `PDFLoader`(SPD01)를 쓴다 |
| 2026-11-04 | 결정 대기 | 상태를 `대기` → **`호출없음`**. 사용자 확인 후 `제외` 확정. 새 코드 없음 |
| 2026-11-04 | 제안(구현하지 않음) | 만약 살린다면 `url` 값을 서버 경로에 그대로 붙이는 방식이라 `../`로 서버의 다른 파일을 읽을 수 있다(원본-이상한점 후보). TOBE에서는 이 방식을 그대로 옮기지 말고 `fileId` 기반으로 설계해야 한다 — 승인 전에는 반영하지 않는다 |
| 2026-11-04 | 참고 | 원본 다른 곳에서 `FileDownload?fileId=`(fileType 없음: `Grid_File`·`Grid_FileDownload`·`Opr03_Lookup_FileUpDownLoad`)와 `FileDownload?actionCode=image&paretId=`(`Lookup_UserImage` L127, 오타)를 부르는데 서블릿은 `fileType`이 없으면 "fileType이 지정되지 않았습니다."만 돌려준다 → AS-IS에서도 동작하지 않는 호출. 해당 화면 변환 기록(`Opr03`·`Lookup_UserImage`)에서 어떻게 처리했는지 대조 필요 |

## 비용
묶음 세션(SFD06 작업기록 참고). 코드 변경 없음.
