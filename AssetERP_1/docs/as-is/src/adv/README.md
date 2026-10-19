# 도메인: adv

화면 3개, 컴포넌트 2개, 서버 클래스 4개, 매퍼 4개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Adv02_Tab_Account`](screens/Adv02_Tab_Account.md) | 펀드관리 > 03. 일임(자문)관리 > 일임계좌 등록 | 2 | 3 |
| [`Adv05_Tab_OrgAuth`](screens/Adv05_Tab_OrgAuth.md) | 펀드관리 > 03. 일임(자문)관리 > 일임계좌 권한설정 | 3 | 4 |
| [`Adv11_Tab_BookExtr`](screens/Adv11_Tab_BookExtr.md) | 펀드관리 > 03. 일임(자문)관리 > 일임보유주식등록(타사무) | 1 | 4 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Adv02_Lookup_SelectMulti`](components/Adv02_Lookup_SelectMulti.md) | apr | 1 | 1 |
| [`Adv02_Lookup_SelectSingle`](components/Adv02_Lookup_SelectSingle.md) | fnd | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`adv.Adv02_Account`](../adv/services/Adv02_Account.md) | 6 |
| [`adv.Adv05_OrgAuth`](../adv/services/Adv05_OrgAuth.md) | 4 |
| [`adv.Adv10_Book`](../adv/services/Adv10_Book.md) | 3 |
| [`adv.Adv11_BookExtr`](../adv/services/Adv11_BookExtr.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`adv02_account`](sql/adv02_account.md) | 13 |
| [`adv05_org_auth`](sql/adv05_org_auth.md) | 2 |
| [`adv10_book`](sql/adv10_book.md) | 4 |
| [`adv11_book_extr`](sql/adv11_book_extr.md) | 4 |

