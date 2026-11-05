# 재설계

## 개요

- AS-IS 의 UI·로직(업무흐름)을 TOBE 에서 다르게 바꾸고 새 기능을 더하는 작업이다 (Strangler Fig).
- 정할 것: 전환 단위(메뉴), 기존 세션과 JWT 의 공존, 문제 시 되돌리는 방법. 아직 문서가 없다.

## 파일 및 폴더

- (아직 없음)

## 재설계 때 해야 할 일 (변환 중 나온 것)

변환 작업에서 미룬 항목을 여기에 모은다. 재설계 작업을 시작할 때 이 목록부터 본다.

### BatchMain(외부 cron 호출) — 2026-11-04 결정
- AS-IS는 외부 cron이 `BatchMain?actionCode=…`을 호출한다(인증 없음). TOBE는 REST + **서버 간 API key + 호출 IP 제한**으로 바꾼다. 따라서 **운영 cron 스크립트의 URL과 키 헤더를 바꿔야 한다**(목록은 서버 crontab에서 직접 확인 — 코드에 없음).
- API key·허용 IP·ICAM 접속 정보는 `application-<profile>.properties`에 둔다(프로필별). 저장소에 실제 값을 넣지 않는다(환경변수·시크릿으로 주입).
- **`ConfigMyBatis-ICAM.xml`·`ConfigMyBatis-ICAM2.xml`을 TOBE에서 쓰지 않는다.** ICAM(운용 서버)·ICAM2(자문 서버)의 Tibero 접속 정보를 `application-<profile>.properties`로 옮긴다. 운영 연동 때 Tibero JDBC 드라이버(상용, 공개 저장소 없음)를 배포물에 포함해야 한다.
- 개발 중에는 ICAM 시뮬레이터(`IcamBatchRunner` 시뮬레이션 구현)를 쓰고, 운영 전환 전에 실 ICAM에 읽기 전용으로 쿼리 결과를 한 번 대조한다.
- 자세한 분기·순서는 `../1-변환/서블릿-변환목록.md` §2-7.


## 연결되는 다른 작업

- 전제: `변환` 완료, `테스트` 통과. 보안 설계는 `../../docs/security-설계.md`.
