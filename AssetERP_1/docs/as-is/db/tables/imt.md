# 테이블: imt

8개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `imt01_server_management` | 서버관리 | 12 |
| `imt02_pc_management` | PC관리(대장) | 11 |
| `imt03_license_management` | 라이센스 관리 | 6 |
| `imt10_server_history` | 서버관리 History | 7 |
| `imt11_server_uniqueness_history` | 서버관리 특이사항 History | 6 |
| `imt12_server_use_history` | 서버용도관리 History | 7 |
| `imt20_pc_history` | PC대장 History | 7 |
| `imt30_license_history` | 라이센스 History | 7 |

## DBML

```dbml
Table "public"."imt01_server_management" {
  "imt01_server_management_id" "numeric" [pk, note: '서버관리ID']
  "imt01_company_id" "numeric" [not null, note: '회사ID']
  "imt01_apply_date" "timestamp without time zone" [note: '도입일자']
  "imt01_host_nm" "character varying(200)" [note: '호스트명']
  "imt01_inout_cd" "character varying(2)" [note: '내부/외부']
  "imt01_ip" "character varying(20)" [note: 'IP']
  "imt01_service_ip" "character varying(20)" [note: 'Service IP']
  "imt01_model" "character varying(200)" [note: '모델명']
  "imt01_os" "character varying(200)" [note: 'OS']
  "imt01_db" "character varying(200)" [note: 'DB']
  "imt01_disk_volume" "character varying(200)" [note: '디스크 용량']
  "imt01_note" "character varying(1500)" [note: '비고']

  Note: '서버관리'
}

Table "public"."imt02_pc_management" {
  "imt02_pc_management_id" "numeric" [pk, note: 'PC관리(대장)ID']
  "imt02_company_id" "numeric" [not null, note: '회사ID']
  "imt02_apply_date" "timestamp without time zone" [note: '도입일자']
  "imt02_host_nm" "character varying(200)" [note: '호스트명']
  "imt02_mac_address" "character varying(200)" [note: 'Mac주소']
  "imt02_internal_ip" "character varying(20)" [note: '내부IP']
  "imt02_kind_cd" "character varying(6)" [note: '구분(01:데스크탑, 02:노트북, 03:태블릿)']
  "imt02_model_nm" "character varying(200)" [note: 'PC모델명']
  "imt02_etc" "character varying(1500)" [note: 'PC기타사양(용량, 램)']
  "imt02_serial_no" "character varying(200)" [note: 'OS시리얼넘버']
  "imt02_note" "character varying(1500)" [note: '비고']

  Note: 'PC관리(대장)'
}

Table "public"."imt03_license_management" {
  "imt03_license_management_id" "numeric" [pk, note: '라이센스 관리ID']
  "imt03_company_id" "numeric" [not null, note: '회사ID']
  "imt03_apply_date" "timestamp without time zone" [note: '최초도입일자']
  "imt03_license_nm" "character varying(200)" [note: '라이센스명']
  "imt03_count" "numeric" [note: '총구입갯수']
  "imt03_note" "character varying(1500)" [note: '비고']

  Note: '라이센스 관리'
}

Table "public"."imt10_server_history" {
  "imt10_server_history_id" "numeric" [pk, note: '서버관리 HistoryID']
  "imt10_server_management_id" "numeric" [not null, note: '서버관리ID']
  "imt10_company_id" "numeric" [not null, note: '회사ID']
  "imt10_person_id" "numeric" [not null, note: '관리자ID']
  "imt10_start_date" "timestamp without time zone" [not null, note: '시작일자']
  "imt10_close_date" "timestamp without time zone" [note: '종료일자']
  "imt10_note" "character varying(1500)" [note: '비고']

  Note: '서버관리 History'
}

Table "public"."imt11_server_uniqueness_history" {
  "imt11_server_uniqueness_history_id" "numeric" [pk, note: '서버관리 특이사항 HistoryID']
  "imt11_server_history_id" "numeric" [not null, note: '서버관리 HistoryID']
  "imt11_company_id" "numeric" [not null, note: '회사ID']
  "imt11_person_id" "numeric" [not null, note: '작성자ID']
  "imt11_apply_date" "timestamp without time zone" [note: '작성일자']
  "imt11_detail" "character varying(1500)" [note: '내용']

  Note: '서버관리 특이사항 History'
}

Table "public"."imt12_server_use_history" {
  "imt12_server_use_history_id" "numeric" [pk, note: '서버용도관리 HistoryID']
  "imt12_server_management_id" "numeric" [not null, note: '서버관리ID']
  "imt12_company_id" "numeric" [not null, note: '회사ID']
  "imt12_use_cd" "character varying(2)" [note: '구분(01:DB, 02:WAS, 03:기타)']
  "imt12_use" "character varying(100)" [note: '구분 상세내용']
  "imt12_detail" "character varying(1500)" [note: '특이사항']
  "imt12_note" "character varying(1500)" [note: '비고']

  Note: '서버용도관리 History'
}

Table "public"."imt20_pc_history" {
  "imt20_pc_history_id" "numeric" [pk, note: 'PC대장 HistoryID']
  "imt20_pc_management_id" "numeric" [not null, note: 'PC관리(대장)ID']
  "imt20_company_id" "numeric" [not null, note: '회사ID']
  "imt20_person_id" "numeric" [not null, note: '사용자ID']
  "imt20_start_date" "timestamp without time zone" [not null, note: '시작일자']
  "imt20_close_date" "timestamp without time zone" [note: '종료일자']
  "imt20_note" "character varying(1500)" [note: '비고']

  Note: 'PC대장 History'
}

Table "public"."imt30_license_history" {
  "imt30_license_history_id" "numeric" [pk, note: '라이센스 HistoryID']
  "imt30_license_management_id" "numeric" [not null, note: '라이센스 관리ID']
  "imt30_company_id" "numeric" [not null, note: '회사ID']
  "imt30_person_id" "numeric" [not null, note: '사원ID']
  "imt30_start_date" "timestamp without time zone" [not null, note: '시작일자']
  "imt30_close_date" "timestamp without time zone" [note: '종료일자']
  "imt30_note" "character varying(1500)" [note: '비고']

  Note: '라이센스 History'
}

```
