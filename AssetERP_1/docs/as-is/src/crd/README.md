# 도메인: crd

화면 3개, 컴포넌트 1개, 서버 클래스 5개, 매퍼 5개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Crd01_Tab_Card`](screens/Crd01_Tab_Card.md) | 경영관리 > 92. 법인카드 등록 > 법인카드 및 사용자등록; 자금관리 > 30. 법인카드관리 > 법인카드 및 사용자등록 | 3 | 9 |
| [`Crd02_Tab_DataUpload`](screens/Crd02_Tab_DataUpload.md) | 경영관리 > 92. 법인카드 등록 > 법인카드 내역 업로드; 자금관리 > 30. 법인카드관리 > 법인카드 내역 업로드 | 3 | 15 |
| [`Crd10_Tab_ExcelCompanyAdmin`](screens/Crd10_Tab_ExcelCompanyAdmin.md) | 기초자료 > 30. 자산&경영 > 법인카드 업로드 기초자료(관리자) | 2 | 6 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Crd02_Lookup_OtherList`](components/Crd02_Lookup_OtherList.md) | biz | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`crd.Crd01_Card`](../crd/services/Crd01_Card.md) | 4 |
| [`crd.Crd02_Data`](../crd/services/Crd02_Data.md) | 11 |
| [`crd.Crd03_Trans`](../crd/services/Crd03_Trans.md) | 5 |
| [`crd.Crd10_ExcelCompany`](../crd/services/Crd10_ExcelCompany.md) | 4 |
| [`crd.Crd11_ExcelCode`](../crd/services/Crd11_ExcelCode.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`crd01_card`](sql/crd01_card.md) | 6 |
| [`crd02_data`](sql/crd02_data.md) | 20 |
| [`crd03_trans`](sql/crd03_trans.md) | 5 |
| [`crd10_excel_company`](sql/crd10_excel_company.md) | 2 |
| [`crd11_excel_code`](sql/crd11_excel_code.md) | 4 |

