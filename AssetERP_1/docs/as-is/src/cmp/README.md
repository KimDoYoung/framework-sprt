# 도메인: cmp

화면 1개, 컴포넌트 1개, 서버 클래스 2개, 매퍼 2개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Cmp10_Tab_MailBook`](screens/Cmp10_Tab_MailBook.md) | 문서작성 > 05. 메일관리 > 공용메일 관리 | 3 | 8 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Cmp10_Lookup_MailBookList`](components/Cmp10_Lookup_MailBookList.md) | dcr | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`cmp.Cmp10_MailBook`](../cmp/services/Cmp10_MailBook.md) | 8 |
| [`cmp.Cmp11_MailRole`](../cmp/services/Cmp11_MailRole.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`cmp10_mail_book`](sql/cmp10_mail_book.md) | 7 |
| [`cmp11_mail_role`](sql/cmp11_mail_role.md) | 5 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Cmp10_Lookup_MailBook` | `client/vi/cmp/Cmp10_Lookup_MailBook.java` | `cmp.Cmp10_MailBook.selectByText` |
