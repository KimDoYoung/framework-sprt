# SFX01 FileDelete `기본(`fileId`) / `filebox`` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `deleteFile L155-193 · deleteFileBox L62-120`. TOBE: `SysFileController.delete` `DELETE /api/v1/sys/files/{fileId}` · `FbxFileController.delete` `DELETE …/{fileId}?boxId`. **판정: 완료** |
| 2026-11-04 | 대조 | 기본: `selectById`로 행을 읽어 실제 파일 삭제(실패해도 로그만) 후 `sys10_file.delete`, 메시지 "파일을 성공적으로 삭제하였습니다.". TOBE `SysFileService.delete`가 같은 순서·같은 메시지. 다른 점: 행이 없으면 AS-IS는 NPE→"Error encountered while deleting file", TOBE는 "등록된 파일정보를 찾을 수 없습니다." |
| 2026-11-04 | 결과 | filebox: AS-IS는 `fbx03_file.delete` → `selectByParentId(fileId)` → 실제 파일 경로를 `{서버경로}/{fileId}`(fbx03 ID, 첨부 파일 ID가 아님)로 만들어 삭제 시도(**경로가 틀려 지워지지 않음**) → 기록 99 → `sys10_file.delete(fbx03 ID)`(**ID가 달라 아무 행도 안 지움**). TOBE `FbxFileService.delete`는 fbx03 삭제·기록 99만 하고 첨부는 남긴다 — 코드 주석에 같은 결함이 적혀 있고 그 결과를 그대로 따른다(원본-이상한점 후보). 등록자만 삭제 검사는 TOBE 보강(원본은 화면 검사) |

## 비용
파일 계열 대조 묶음 세션. 코드 변경 없음.
