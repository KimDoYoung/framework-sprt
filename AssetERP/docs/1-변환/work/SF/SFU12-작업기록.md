# SFU12 FileUpload/소형 업로드 `IssuingEntityUpload` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `IssuingEntityUpload.uploadFile L51-137`. TOBE: `FndIssuingEntityController` `POST …/upload` → `FndIssuingEntityService.upload`. **판정: 완료** |
| 2026-11-04 | 대조 | MS949 텍스트 한 줄 = 한 기관(코드·이름·소속구분·액면가·결산월·국가). 칸 0에서 `selectByCodeName`(이름 LIKE 쿼리라 코드로 찾아 거의 새 행 — TOBE 주석에도 그대로 옮김)·`insertUpdate`, 오류 시 전체 롤백, 메시지 `파일을 성공적으로 등록하였습니다.`. TOBE 서비스 코드를 줄 단위로 읽어 칸 번호·분기·롤백이 같음을 확인(EE13에서 시험됨) |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
