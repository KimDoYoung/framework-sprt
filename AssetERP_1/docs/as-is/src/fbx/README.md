# 도메인: fbx

화면 3개, 컴포넌트 0개, 서버 클래스 3개, 매퍼 3개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Fbx01_Tab_BoxDocument`](screens/Fbx01_Tab_BoxDocument.md) | 문서작성 > 03. 파일 및 양식관리 > 파일보관함 | 2 | 5 |
| [`Fbx01_Tab_Document`](screens/Fbx01_Tab_Document.md) | 문서작성 > 03. 파일 및 양식관리 > 파일등록 | 3 | 7 |
| [`Fbx01_Tab_Search`](screens/Fbx01_Tab_Search.md) | 문서작성 > 03. 파일 및 양식관리 > 파일조회 | 3 | 6 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`fbx.Fbx01_Box`](../fbx/services/Fbx01_Box.md) | 5 |
| [`fbx.Fbx02_History`](../fbx/services/Fbx02_History.md) | 2 |
| [`fbx.Fbx03_File`](../fbx/services/Fbx03_File.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`fbx01_box`](sql/fbx01_box.md) | 3 |
| [`fbx02_history`](sql/fbx02_history.md) | 4 |
| [`fbx03_file`](sql/fbx03_file.md) | 6 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Fbx03_Viewer` | `client/vi/fbx/Fbx03_Viewer.java` | `fbx.Fbx03_File.view` |
