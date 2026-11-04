# SFU10 FileUpload/소형 업로드 ``fileType=image` 이미지 업로드` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `FileUpload.service L44-90 (모드 아님)`. TOBE: = SFU01 (`SysFileController.upload`). **판정: 설계필요** |
| 2026-11-04 | 대조 | `fileType`은 서블릿이 읽지 않는다 — `FileUpload?fileType=image&parentId=`은 `mode`가 없어 **기본 모드(SFU01)**로 간다(이미지는 따로 줄이거나 하나만 남기지 않고, 보기는 `selectOneByParentId`의 최근 1건). 그래서 이 ID의 결정은 SFU01(허용 형식·사원 사진 축소)과 같다 |
| 2026-11-04 | 결과 | 호출 화면(`Apr10_Tab_Stamp` L104, `Emp60_Tab_Sign` L99, `Emp01_TabPage_Person` L143, `Emp02_TabPage_Others` L107, `MyInfoPopup` L123, `Sys01_Page_Logo` L118·139)의 TOBE 연결은 화면 ID의 일이다 — Apr10_Tab_Stamp·Emp60은 연결됨, Emp01·02 탭의 사진 칸은 "파일 B10 뒤"로 미룬 채 남아 있다(B10은 끝났으므로 화면 후속 작업 후보) |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
