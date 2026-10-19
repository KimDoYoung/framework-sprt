# 테이블: bnd

1개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `bnd01_bond_info` | 채권정보 | 6 |

## DBML

```dbml
Table "public"."bnd01_bond_info" {
  "bnd01_bond_info_id" "numeric" [pk, note: '채권정보id']
  "bnd01_bond_name" "character varying(100)" [not null, note: '채권명']
  "bnd01_bond_cd" "character varying(50)" [note: '채권코드']
  "bnd01_issue_date" "timestamp without time zone" [note: '발행일']
  "bnd01_company_id" "numeric" [not null, note: '회사id']
  "bnd01_note" "character varying(500)"

  Note: '채권정보'
}

```
