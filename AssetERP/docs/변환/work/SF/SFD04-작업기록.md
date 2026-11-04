# SFD04 FileDownload `fbxFile` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 대조 | 원본 `downloadFbxFile L218-254`. TOBE: `FbxFileController.download` `GET /api/v1/fbx/files/{fileId}/download?boxId` → `FbxFileService.download` |
| 2026-11-04 | 결과 | **완료.** AS-IS는 `fileId`를 **부모 ID**로 보고 `sys10_file.selectByParentId`의 첫 행을 내려준 뒤 `fbx02_history.insertHistory`(다운로드 기록)를 남긴다. TOBE도 `firstAttach`(첫 행)를 내려주고 기록 `04`를 남긴다. **다른 점**: TOBE는 보관함·사원 소유 확인(`selectOwned`)을 먼저 하고(TOBE 쪽 권한 보강 — AS-IS에는 없는 검사. 확인 안 함: 이 검사가 AS-IS 화면이 보여 주는 목록과 어긋나 정상 사용을 막는지는 화면 시험에서 볼 것), 기록을 전송 전에 한다(AS-IS는 전송 후) |
| 2026-11-04 | 참고 | 호출 화면 `Fbx01_Grid_DocList` L113·`Fbx01_TabPage_DocList` L125 → TOBE `fbx.ts` `download`. `empId`·`orgId` 파라미터는 TOBE가 로그인 사용자에서 얻는다 |

## 비용
파일 계열 대조 묶음 세션(SFD01~08). 코드 변경 없음. `yunhee cat FileDownload.java`·`yunhee grep`·`analysis sql`로 대조.
