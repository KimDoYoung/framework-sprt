# framework 작업

## 개요

- AssetERP(GWT+GXT)를 Springboot, React로 변경하는 것으 염두에 두고 테스트 프로젝트를 작성해 본다
- ASIS AssetERP의 기술 스택은 GWT/GXT, Postgresql, MyBatis
- TOBE Springboot, React
- 이 프로젝트는 기존 AssetERP를 새로운 기술스택즉 Springboot/React/Mybatis로 변경하는 것이다.
- 변경의 이유는 GWT/GXT가 더이상 발전적이지 않은 기술이고, GXT가 java8만을 지원하기 때문이다.

## 최종 목적

- 새로운 framework의 개발
- 기존 ASIS의 TOBE로의 전환 방법을 확립
- ASIS->TOBE로의 전환
- ASIS, TOBE의 병행 운용 후 TOBE로의 완전 전환


## 예상되는 문제점

1. ASIS AssetERP는 수년에 걸쳐서 유지보수되었으면 100여개의 자산운용회사에 서비스되고 있는 수백페이지에 해당하는 큰 사이즈이다.
2. 기술인력이 모두 TOBE 기술스택에 익숙치 않다.


## 테스트 환경

### db

- local에 postgresql, redis database를 설치, WAS tomcat설치함
- @docs/docker-compose.yml 참조
- deploy.sh로 배포함

## 폴더

- antdesign : UI테스트, Ant Design으로 화면디자인을 만들어 봄 



