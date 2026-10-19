# 도메인: com

화면 0개, 컴포넌트 5개, 서버 클래스 4개, 매퍼 4개.

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Com01_Lookup_RelateAppr`](components/Com01_Lookup_RelateAppr.md) | biz, pay, tdm | 2 | 6 |
| [`Com01_Lookup_RelateFile`](components/Com01_Lookup_RelateFile.md) | fnd | 1 | 2 |
| [`Com10_Lookup_CommonMapping`](components/Com10_Lookup_CommonMapping.md) | dcr | 1 | 1 |
| [`Com11_Lookup_FormMappingMulti`](components/Com11_Lookup_FormMappingMulti.md) | est | 1 | 1 |
| [`Com50_Lookup_StkItem`](components/Com50_Lookup_StkItem.md) | adv, flt, fnd, sch | 1 | 3 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`com.Com01_RelateAppr`](../com/services/Com01_RelateAppr.md) | 7 |
| [`com.Com10_FormMapping`](../com/services/Com10_FormMapping.md) | 6 |
| [`com.Com11_FormMappingMulti`](../com/services/Com11_FormMappingMulti.md) | 8 |
| [`com.Com50_Item`](../com/services/Com50_Item.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`com01_relate_appr`](sql/com01_relate_appr.md) | 6 |
| [`com10_form_mapping`](sql/com10_form_mapping.md) | 5 |
| [`com11_form_mapping_multi`](sql/com11_form_mapping_multi.md) | 5 |
| [`com50_item`](sql/com50_item.md) | 9 |

