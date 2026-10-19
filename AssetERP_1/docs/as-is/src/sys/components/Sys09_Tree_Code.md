# Sys09_Tree_Code

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `crm`
- 파일: `client/vi/sys/Sys09_Tree_Code.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys09_Code.selectByCode` | Sys09_Tree_Code:61 | [`Sys09_Code.java:100`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys09_Tree_Code (`client/vi/sys/Sys09_Tree_Code.java`, 99줄)


#### 이벤트
[E0] 화면 열림 (생성자 L42-54) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getKey() | L24-26 | 공개 메서드 | 상태 처리 | 업무 |
| public getValue() | L30-32 | 공개 메서드 | 상태 처리 | 업무 |
| public setValue() | L34-35 | 공개 메서드 | 상태 처리 | 업무 |
| public getPath() | L37-39 | 공개 메서드 | 상태 처리 | 업무 |
| public getTree() | L56-58 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L60-66 | 공개 메서드 | 서비스 sys.Sys09_Code.selectByCode | 업무 |
| public getServiceResult() | L80-96 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

