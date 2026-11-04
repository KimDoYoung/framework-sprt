# SFD05 FileDownload `zip` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 대조 | 원본 `downloadZip L360-389`. TOBE: (없음 — 이전에 적힌 `SysFileController.downloadZip`은 `selectList`(SFD06)용) |
| 2026-11-04 | 결과 | **제외.** AS-IS는 `sys10_file.selectByApprRelateDocFile`(사원·조직·펀드 조건: `sintak`·`publicSubscribe`·`empName`·`fundType`·`fundClose`·`orgName`·`classTreeName`·`fundName`)로 파일을 모아 `Asset-ERP.zip`. 호출 화면은 `Dcr00_Tab_Download` L431 **하나뿐**이고 이 화면은 `13-누락대장.md` L55에서 **제외(사용자 결정 2026-11-03)** |
| 2026-11-04 | 참고 | 화면이 제외라 분기도 제외(SED03과 같은 사유). 문서작성 > 문서 다운로드 화면을 되살리면 이 분기와 `selectByApprRelateDocFile` SQL 이식이 같이 필요하다 |

## 비용
파일 계열 대조 묶음 세션(SFD01~08). 코드 변경 없음. `yunhee cat FileDownload.java`·`yunhee grep`·`analysis sql`로 대조.
