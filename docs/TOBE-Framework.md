# TOBE Framework

## 개요

1. 새로운 프레임워크는 기본적으로 Springboot, React를 기반으로 하는 backend/frontend 로 나누어 개발한다.


## 원칙

1. 최신 기술이면 오픈소스를 사용한다.
2. 자바 21을 기본으로 사용한다.
3. tomcat 10을 기본적인 WAS로 고려한다.
4. 개발자는 최대한 비지니스로직에 집중할 수 있게한다.
5. 개발자는 최소한의 기술적 지식만을 갖고도 업무를 개발할 수 있어야 한다.
6. AI Agent의 도움을 받으면서 개발할 수 있어야 한다.
7. framework는 네이밍 규칙등 규칙을 갖고 있으며 개발된 내용은 이 규칙에 맞아야한다.

> Strict Rules, Simple Code, AI-Powered Business

## 규칙

### backend

### backend 규칙

1. **기본 정보**
   - Base Package: `kr.co.kfs.asseterp`
   - Entry Point: `Main.java`
   - Java 21 표준 기능 적극 활용 (DTO는 `record`, 날짜는 `java.time.*`)

2. **패키지 및 레이어 구조**
   - `common.*`: 공통 모듈 (Security, Config, Error, Utils)
   - `biz.<domain>.*`: 도메인별 업무 패키지
     - `controller` : REST API 엔드포인트 (@RestController, 요청 검증)
     - `service` : 업무 로직 (@Service, @Transactional)
     - `mapper` : MyBatis 매퍼 인터페이스 및 SQL 매핑
     - `dto` : 요청/응답 Record (CreateReq, UpdateReq, Res)

3. **API & 네이밍 컨벤션**
   - URL: `/api/v1/{domain}/{resource}` (RESTful 원칙)
   - 컨트롤러/서비스/매퍼 명명: `{Domain}Controller`, `{Domain}Service`, `{Domain}Mapper`
   - 메서드 접두사: 조회(`get/search`), 등록(`create`), 수정(`update`), 삭제(`delete`)

4. **응답 및 예외 처리 표준**
   - 모든 API는 프레임워크 공통 응답 포맷(`ApiResponse<T>`)으로 반환
   - 비즈니스 예외는 `BusinessException`으로 일원화하고 `RestControllerAdvice`에서 자동 응답

5. **DB & 트랜잭션**
   - MyBatis 파라미터는 Map 지양, 전용 DTO/VO 사용
   - 카멜케이스(Java) ↔ 스네이크케이스(DB) 자동 매핑
   - Service 기본 읽기 전용 트랜잭션(`readOnly = true`), CUD 메서드에만 쓰기 트랜잭션 선언

6. Lombok 및 정적 분석 규칙

- **Lombok 사용 범위 제한**
  - 허용: `@RequiredArgsConstructor`, `@Slf4j`, `@Getter`, `@Builder`
  - 금지: `@Setter`, `@Data` (무분별한 객체 상태 변경 및 순환 참조 방지)
  - DTO는 Lombok 기반 클래스 대신 Java 21 `record` 사용 권장

- **정적 코드 분석 통과 (Quality Gate)**
  - IDE(SonarLint) 및 CI 빌드 시 정적 분석 검사 통과 필수
  - Blocker / Critical 레벨 버그 및 취약점 0건 유지
  - 표준 코드 스타일러(Spotless/Checkstyle)를 통한 포맷 자동 정렬 준수

### frontend

1. Dashboard -> MyPage라는 용어를 사용할 것
2. Tailwindcss의 사용은 자제한다.
3. icon은 ant design의 것을 사용한다.
4. flexlayout-react의 도입, split panel에서 tab
  - 화면 layout을 저장, 호출해서 변경가능
5. Status bar의 도입- topbar와 statubar사이에 contents가 보여짐으로서 안정감과 스크롤없는 편안한 조작  
6. 뷰포트 피팅 레이아웃 (Viewport-Fitting Layout / Fit-to-Window) 도입
  - 논스크롤 / 고정 뷰포트 (No-Scroll Body / Fixed Viewport Layout)
  - 내부 가상 스크롤 격리 (Isolated Internal Virtual Scrolling)


