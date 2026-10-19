# 도메인: icr

화면 2개, 컴포넌트 3개, 서버 클래스 2개, 매퍼 2개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Icr01_Tab_ClassTree`](screens/Icr01_Tab_ClassTree.md) | 준법감시 > 01. 법규관리 > 내규관리 | 10 | 17 |
| [`Icr01_Tab_ClassTreeView`](screens/Icr01_Tab_ClassTreeView.md) | 준법감시 > 00. 법규정보 > 내규조회 | 6 | 12 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Icr01_Lookup_ClassTreeDetail`](components/Icr01_Lookup_ClassTreeDetail.md) | sch, tdm | 1 | 1 |
| [`Icr01_Lookup_SelectMulti`](components/Icr01_Lookup_SelectMulti.md) | apr, dcr, tdm | 3 | 5 |
| [`Icr01_Page_IcrFile`](components/Icr01_Page_IcrFile.md) | apr, sch, tdm | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`icr.Icr01_ClassTree`](../icr/services/Icr01_ClassTree.md) | 19 |
| [`icr.Icr05_RelateManager`](../icr/services/Icr05_RelateManager.md) | 6 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`icr01_class_tree`](sql/icr01_class_tree.md) | 22 |
| [`icr05_relate_manager`](sql/icr05_relate_manager.md) | 7 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Icr01_Lookup_IcrFileAdmin` | `client/vi/icr/Icr01_Lookup_IcrFileAdmin.java` | `sys.Sys10_File.getIcsFile` |
| `IcrComboBoxField` | `client/vi/icr/IcrComboBoxField.java` | `icr.Icr01_ClassTree.selectByParentTreeId` |
