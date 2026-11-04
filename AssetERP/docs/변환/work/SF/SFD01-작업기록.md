# SFD01 FileDownload `image` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 대조 | 원본 `downloadImage L187 → downloadGenericImage L195-215`. TOBE: `SysFileController.getImage` `GET /api/v1/sys/files/image?fileId|parentId` → `SysFileService.getImage` |
| 2026-11-04 | 결과 | **완료.** `fileId`가 있으면 그것, 없고 `parentId`가 있으면 그 부모의 최근 1건, 없거나 서버에 파일이 없으면 `{업로드 폴더}/nonamed.jpg`, 내용 형식 `image/{확장자}`. TOBE 같음. **다른 점(기록만)**: 기본 이미지도 없으면 AS-IS는 빈 응답, TOBE는 404 / 파일이 없어 기본 이미지로 바꿔도 AS-IS는 원래 파일의 확장자·이름을 형식에 쓰지만 TOBE는 `image/jpg`·`nonamed.jpg` |
| 2026-11-04 | 참고 | TOBE 호출 화면은 `Apr10_Lookup_DocStamp`·`Apr10_Lookup_Stamp`·`Apr10_Tab_Stamp`·`Emp00_Tab_OrgPerson`·`Emp00_Tab_OrgEmpManager`·`Emp60_Tab_Sign`. **아직 안 쓰는 AS-IS 호출 화면(화면 2단계)**: `Emp00_Tab_TransInfo` 사진 칸(L290·427), `Emp01_TabPage_Person` 사진(L143·166·399)·`Emp02_TabPage_Others` 사진(L107·130·404) — 두 탭 모두 "사진은 파일 공통(B10) 뒤"로 미뤄 둔 상태(B10은 끝남), `MyInfoPopup`·`MyPage`(기본 사진), `Sys01_Page_Logo`(로고·메인 이미지). 이 화면들은 서블릿이 아니라 각 화면 ID의 일이다(SFU10 이미지 업로드와 한 묶음) |

## 비용
파일 계열 대조 묶음 세션(SFD01~08). 코드 변경 없음. `yunhee cat FileDownload.java`·`yunhee grep`·`analysis sql`로 대조.
