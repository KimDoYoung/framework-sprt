# C 공통화 후보 (2026-11-06, 126건)
CPD 중복 블록. 점수 = 줄 수 × (출현-1) × (도메인 간이면 2). 한 후보씩, 사용자 승인 뒤 진행:
util/공통 서비스 작성 → 쓰는 곳 교체 → `bm.sh compile` → 영향 API 를 `yunhee api` 로 확인.

## CH-cpd-39c030d6 — 엑셀 · 도메인 간 · 29줄×6곳 (점수 290)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, crd, fnd, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:40-68`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:82-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/crd/service/CrdCardUploadService.java:37-64`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndAccountService.java:80-108`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndBookExtrService.java:82-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:135-163`

```java
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.", e);
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 계좌: 관리코드(0)·계좌명(1)·계좌번호(2)·증권사명(3)·최초설정일(4)·해지일(5).
     * 증권사명은 사용 중인 증권회사(거래처구분 3)의 이름과 같아야 하고(코드는 그 거래처 것), 같은 관리코드가 이미 있으면 막는다(원본은 갱신 코드를 주석 처리).
     * 한 행이라도 오류면 전체 롤백. 등록한 건수를 돌려준다.
```

## CH-cpd-9b7956e4 — 엑셀 · 도메인 간 · 31줄×4곳 (점수 186)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, fnd, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:79-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndAccountService.java:77-108`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndBookExtrService.java:79-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:132-163`

```java
        mapper.deleteBookExtrs(user.getCompanyId(), bookExtrIds);
    }

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.", e);
        }
    }

    /**
```

## CH-cpd-d1235a4e — 엑셀 · 도메인 간 · 27줄×4곳 (점수 162)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: flt, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltBookInitService.java:218-244`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:214-240`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:390-416`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:269-295`

```java
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
```

## CH-cpd-47bf38b7 — 엑셀 · 도메인 간 · 11줄×8곳 (점수 154)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, bbs, crd, fnd, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:58-68`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/bbs/service/BbsCompanyRuleService.java:271-281`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/crd/service/CrdCardUploadService.java:54-64`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndAccountService.java:98-108`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndBookExtrService.java:99-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:58-68`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndOprFundService.java:119-129`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:153-163`

```java
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
```

## CH-cpd-06846d92 — 엑셀 · 도메인 간 · 11줄×8곳 (점수 154)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, car, crd, fnd, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:58-68`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/car/service/CarJournalUploadService.java:59-69`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/crd/service/CrdCardUploadService.java:54-64`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndAccountService.java:98-108`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndBookExtrService.java:99-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:58-68`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndOprFundService.java:119-129`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:153-163`

```java
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
```

## CH-cpd-77157f30 — 엑셀 · 도메인 간 · 19줄×5곳 (점수 152)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, flt, fnd, icam, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:102-120`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltRealTrService.java:375-393`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:119-137`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:146-164`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:299-317`

```java
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
        if (cell == null) {
            return null;
        }
        Date date;
        if (cell.getCellType() == CellType.STRING) {
            try {
                date = new SimpleDateFormat("yyyyMMdd").parse(cell.getStringCellValue().replaceAll("[.-]", "").trim());
            } catch (ParseException e) {
```

## CH-cpd-564adef0 — 엑셀 · 도메인 간 · 71줄×2곳 (점수 142)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:43-113`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndBookExtrService.java:43-113`

```java
    private final AdvBookExtrMapper mapper;

    /** AS-IS selectByStdDate: 검색어는 클라이언트가 "%…%"로 보낸다 */
    public List<BookExtrRes> search(UserPrincipal user, LocalDate stdDate, String searchText) {
        return mapper.selectByStdDate(user.getCompanyId(), stdDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS selectRecentStdDate: 그 날 이전 가장 최근 기준일(yyyy-MM-dd), 없으면 null */
    public String recentStdDate(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectRecentStdDate(user.getCompanyId(), stdDate);
    }

```

## CH-cpd-df76c1cc — 엑셀 · 도메인 간 · 22줄×4곳 (점수 132)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, car, crd, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:128-149`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/car/service/CarJournalUploadService.java:79-100`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/crd/service/CrdCardUploadService.java:75-96`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndBookExtrService.java:128-149`

```java
                mapper.excelInsert(companyId, stdDate, manageCode, manageName, itemCode, itemName, ITEM_TYPE_STOCK);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 */
```

## CH-cpd-e6edd1da — 엑셀 · 도메인 간 · 21줄×4곳 (점수 126)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: flt, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltRealTrService.java:373-393`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:242-262`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:418-438`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:297-317`

```java
        }
        return null;
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
        if (cell == null) {
            return null;
        }
        Date date;
        if (cell.getCellType() == CellType.STRING) {
            try {
```

## CH-cpd-b6bb8e64 — 컨트롤러 반복 · 같은 도메인 · 25줄×6곳 (점수 125)

- 권고: 공통 컨트롤러 메서드/인자 해석기로
- 도메인: pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/controller/PayDeductTableController.java:32-56`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/controller/PayOtherSetupController.java:31-55`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/controller/PayPersonDeductController.java:31-55`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/controller/PaySimpleTaxController.java:33-57`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/controller/PayTaxCalcController.java:31-55`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/controller/PayTaxDeductController.java:33-57`

```java
    private final PayDeductTableService service;

    /** AS-IS pay.Pay24_DeductTable.selectByAll */
    @GetMapping("/dates")
    public ApiResponse<List<PayStartDateRes>> searchDates() {
        return ApiResponse.ok(service.searchDates());
    }

    /** AS-IS pay.Pay24_DeductTable.insert (적용일 생성) */
    @PostMapping("/dates")
    public ApiResponse<Void> createDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayStartDateReq req) {
        service.createDate(principal, req.startDate());
```

## CH-cpd-84d35326 — 엑셀 · 도메인 간 · 24줄×3곳 (점수 96)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, ics, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:79-102`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ics/service/IcsChecklistService.java:141-165`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:132-156`

```java
        mapper.deleteBookExtrs(user.getCompanyId(), bookExtrIds);
    }

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.", e);
        }
    }

    /**
```

## CH-cpd-06eab4c7 — 엑셀 · 도메인 간 · 22줄×3곳 (점수 88)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: flt, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltBookInitService.java:230-251`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PaySimpleTaxService.java:168-188`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:281-302`

```java
    }

    /** ExcelUpload.getLongCellData */
    private static Long cellLong(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.FORMULA) {
            return cell.getCachedFormulaResultType() == CellType.NUMERIC ? (long) cell.getNumericCellValue() : null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
```

## CH-cpd-cc84329a — 엑셀 · 도메인 간 · 11줄×5곳 (점수 88)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, icam, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:59-69`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:107-117`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:154-164`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:358-368`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:239-249`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
```

## CH-cpd-64a61442 — 엑셀 · 도메인 간 · 11줄×5곳 (점수 88)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd, icam, kfs, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndAccountService.java:99-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:107-117`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:75-85`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:358-368`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:239-249`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
```

## CH-cpd-fa7ff7bb — 기타 로직 · 같은 파일 · 29줄×4곳 (점수 87)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:41-69`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:167-196`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:284-312`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:410-439`

```java
    public static String html1_01(UnLeaveNoticeRow unLeaveModel, LocalDate date01, LocalDate date02) {
        String text = 
                tableStart + 
                    tbodyrStart + 
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
```

## CH-cpd-86d8bdd3 — 엑셀 · 도메인 간 · 41줄×2곳 (점수 82)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:81-121`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:98-138`

```java
                        LocalDateTime.now(), user.getName()));
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
```

## CH-cpd-5650c52f — 엑셀 · 도메인 간 · 20줄×3곳 (점수 80)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:102-121`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:244-263`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:420-439`

```java
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
        if (cell == null) {
            return null;
        }
        Date date;
        if (cell.getCellType() == CellType.STRING) {
            try {
                date = new SimpleDateFormat("yyyyMMdd").parse(cell.getStringCellValue().replaceAll("[.-]", "").trim());
            } catch (ParseException e) {
```

## CH-cpd-586a900c — 엑셀 · 도메인 간 · 10줄×5곳 (점수 80)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, icam, kfs, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:100-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:107-116`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:75-84`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:358-367`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:239-248`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 기준일은 필수입력입니다.");
```

## CH-cpd-3c72aeae — 엑셀 · 도메인 간 · 10줄×5곳 (점수 80)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: bbs, icam, kfs, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/bbs/service/BbsCompanyRuleService.java:272-281`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:107-116`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:75-84`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:358-367`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:239-248`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
```

## CH-cpd-5f8af986 — 엑셀 · 도메인 간 · 10줄×5곳 (점수 80)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: car, icam, kfs, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/car/service/CarJournalUploadService.java:60-69`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:107-116`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:75-84`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:358-367`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:239-248`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 사용일자는 필수입력입니다.");
```

## CH-cpd-0657949d — 엑셀 · 도메인 간 · 10줄×5곳 (점수 80)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: crd, icam, kfs, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/crd/service/CrdCardUploadService.java:55-64`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:107-116`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:75-84`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:358-367`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:239-248`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 시작일자는 필수입력입니다.");
```

## CH-cpd-618d47cc — 엑셀 · 도메인 간 · 10줄×5곳 (점수 80)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd, icam, kfs, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndBookExtrService.java:100-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:107-116`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:75-84`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:358-367`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:239-248`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 기준일은 필수입력입니다.");
```

## CH-cpd-a991ac6c — 엑셀 · 도메인 간 · 19줄×3곳 (점수 76)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, kfs, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:84-102`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:102-120`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:263-281`

```java
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
```

## CH-cpd-b8cd8d98 — 컨트롤러 반복 · 도메인 간 · 36줄×2곳 (점수 72)

- 권고: 공통 컨트롤러 메서드/인자 해석기로
- 도메인: adv, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/controller/AdvBookExtrController.java:35-70`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/controller/FndBookExtrController.java:35-70`

```java
    private final AdvBookExtrService service;

    /** AS-IS adv.Adv11_BookExtr.selectByStdDate */
    @GetMapping
    public ApiResponse<List<BookExtrRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                 @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, stdDate, searchText));
    }

    /** AS-IS adv.Adv11_BookExtr.selectRecentStdDate → yyyy-MM-dd 또는 null */
    @GetMapping("/recent-std-date")
```

## CH-cpd-07e00484 — 엑셀 · 도메인 간 · 35줄×2곳 (점수 70)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:128-162`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndBookExtrService.java:128-162`

```java
                mapper.excelInsert(companyId, stdDate, manageCode, manageName, itemCode, itemName, ITEM_TYPE_STOCK);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 */
```

## CH-cpd-b8225ce4 — 엑셀 · 도메인 간 · 35줄×2곳 (점수 70)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, crd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:128-162`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/crd/service/CrdCardUploadService.java:75-109`

```java
                mapper.excelInsert(companyId, stdDate, manageCode, manageName, itemCode, itemName, ITEM_TYPE_STOCK);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 */
```

## CH-cpd-b8c2910d — 엑셀 · 도메인 간 · 35줄×2곳 (점수 70)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: flt, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltRealTrService.java:330-364`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:268-302`

```java
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
```

## CH-cpd-305cd054 — 엑셀 · 도메인 간 · 34줄×2곳 (점수 68)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: flt, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltBookInitService.java:218-251`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:269-302`

```java
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
```

## CH-cpd-b490f1c4 — 엑셀 · 도메인 간 · 11줄×4곳 (점수 66)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd, icam, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:59-69`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:107-117`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:358-368`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:239-249`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
```

## CH-cpd-6b03c563 — 엑셀 · 도메인 간 · 11줄×4곳 (점수 66)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd, icam, pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndOprFundService.java:120-130`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:107-117`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:358-368`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:239-249`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
```

## CH-cpd-894c77e8 — 엑셀 · 도메인 간 · 32줄×2곳 (점수 64)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, icam
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:90-121`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:134-165`

```java
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
```

## CH-cpd-950d9541 — 엑셀 · 도메인 간 · 32줄×2곳 (점수 64)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd, icam
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:107-138`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:134-165`

```java
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
```

## CH-cpd-6f9e3f92 — 엑셀 · 도메인 간 · 16줄×3곳 (점수 64)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, fnd, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:55-70`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndOprFundService.java:116-131`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:150-165`

```java
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
```

## CH-cpd-ddda8b57 — 기타 로직 · 같은 파일 · 21줄×4곳 (점수 63)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:45-65`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:173-193`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:289-309`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:416-436`

```java
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
            
```

## CH-cpd-f8d1a9ae — 기타 로직 · 같은 도메인 · 21줄×4곳 (점수 63)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayOtherSetupService.java:78-98`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayPersonDeductService.java:86-106`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayRateService.java:53-73`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayTaxCalcService.java:87-107`

```java
                return mapper.selectById(req.otherSetupId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
```

## CH-cpd-b9b676cb — 엑셀 · 도메인 간 · 31줄×2곳 (점수 62)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:40-70`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:135-165`

```java
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.", e);
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 계좌: 관리코드(0)·계좌명(1)·계좌번호(2)·증권사명(3)·최초설정일(4)·해지일(5).
     * 증권사명은 사용 중인 증권회사(거래처구분 3)의 이름과 같아야 하고(코드는 그 거래처 것), 같은 관리코드가 이미 있으면 막는다(원본은 갱신 코드를 주석 처리).
     * 한 행이라도 오류면 전체 롤백. 등록한 건수를 돌려준다.
```

## CH-cpd-8d5c40c8 — 엑셀 · 도메인 간 · 31줄×2곳 (점수 62)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, crd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:38-68`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/crd/service/CrdCardUploadService.java:35-64`

```java
    private final AdvAccountMapper mapper;

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.", e);
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 계좌: 관리코드(0)·계좌명(1)·계좌번호(2)·증권사명(3)·최초설정일(4)·해지일(5).
```

## CH-cpd-6e59060b — 엑셀 · 도메인 간 · 30줄×2곳 (점수 60)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:40-69`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndAccountService.java:80-109`

```java
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.", e);
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 계좌: 관리코드(0)·계좌명(1)·계좌번호(2)·증권사명(3)·최초설정일(4)·해지일(5).
     * 증권사명은 사용 중인 증권회사(거래처구분 3)의 이름과 같아야 하고(코드는 그 거래처 것), 같은 관리코드가 이미 있으면 막는다(원본은 갱신 코드를 주석 처리).
     * 한 행이라도 오류면 전체 롤백. 등록한 건수를 돌려준다.
```

## CH-cpd-08cf3fb1 — 엑셀 · 도메인 간 · 29줄×2곳 (점수 58)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:388-416`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:267-295`

```java
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년도를 입력해주세요", e);
        }
    }

    /** ExcelUpload.getStringCellData — 셀이 없으면 null, 숫자는 정수면 정수 글자, 아니면 소수 글자 */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
```

## CH-cpd-54d34652 — 기타 로직 · 같은 도메인 · 19줄×4곳 (점수 57)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: act
- `backend/src/main/java/kr/co/kfs/asseterp/biz/act/service/ActJournalMapService.java:52-70`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/act/service/ActRealAccountMapService.java:43-61`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/act/service/ActReprAccountService.java:50-68`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/act/service/ActTrMapService.java:46-64`

```java
            Long id = isNew ? mapper.selectNextId() : req.journalMapId();
            if (isNew) {
                mapper.insert(id, user.getCompanyId(), req);
            } else if (mapper.update(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다 */
```

## CH-cpd-83ecad36 — 엑셀 · 도메인 간 · 28줄×2곳 (점수 56)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: flt, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltRealTrService.java:330-357`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:389-416`

```java
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
```

## CH-cpd-6f39d84a — 기타 로직 · 도메인 간 · 25줄×2곳 (점수 50)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: cmp, emp
- `backend/src/main/java/kr/co/kfs/asseterp/biz/cmp/service/CmpMailBookService.java:78-102`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/emp/service/EmpPersonMailService.java:68-90`

```java
            return new CmpMailCheckRes(false, "메일서버( " + mailInfo + " )가 설정되지 않았습니다. 관리자에게 연락바랍니다.");
        }

        Properties properties = new Properties();
        properties.putAll(config);
        properties.putIfAbsent("mail.smtp.connectiontimeout", SMTP_TIMEOUT);
        properties.putIfAbsent("mail.smtp.timeout", SMTP_TIMEOUT);
        properties.putIfAbsent("mail.smtp.writetimeout", SMTP_TIMEOUT);

        String username = req.mailAddress();
        String password = req.password();
        Session session = Session.getInstance(properties, new Authenticator() {
```

## CH-cpd-c122ad00 — 엑셀 · 도메인 간 · 25줄×2곳 (점수 50)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:81-105`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:260-284`

```java
                        LocalDateTime.now(), user.getName()));
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
```

## CH-cpd-e402aeb6 — 엑셀 · 도메인 간 · 25줄×2곳 (점수 50)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:98-122`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:260-284`

```java
                mapper.excelInsertInfo(info);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
```

## CH-cpd-e41d515f — 엑셀 · 도메인 간 · 12줄×3곳 (점수 48)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, kfs, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:59-70`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:75-86`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:154-165`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                String manageCode = cellString(row.getCell(0));
```

## CH-cpd-d5613573 — 엑셀 · 같은 도메인 · 45줄×2곳 (점수 45)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: flt
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltBookInitService.java:218-262`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltRealTrService.java:331-375`

```java
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
```

## CH-cpd-3cc60eee — 파일 통째 복제 · 도메인 간 · 22줄×2곳 (점수 44)

- 권고: 같은 AS-IS 부품을 도메인마다 복사한 것 — 공통 서비스 하나로 합치고 도메인은 위임
- 도메인: adv, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/mapper/AdvBookExtrMapper.java:12-33`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/mapper/FndBookExtrMapper.java:12-33`

```java
public interface AdvBookExtrMapper {

    /** AS-IS adv11_book_extr.selectByStdDate */
    List<BookExtrRes> selectByStdDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText);

    /** AS-IS adv11_book_extr.selectRecentStdDate (없으면 null) */
    String selectRecentStdDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS adv11_book_extr.selectById (UpdateDataModel이 저장 뒤 읽는 행) */
    BookExtrRes selectById(@Param("bookExtrId") Long bookExtrId);

    /** AS-IS dbConfig.getSeq */
```

## CH-cpd-ffb2a353 — 엑셀 · 도메인 간 · 22줄×2곳 (점수 44)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: icam, kfs
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:96-117`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:63-85`

```java
    }

    /**
     * AS-IS ExcelUpload.icamUserStopUpload L1761-1823 — 첫 시트 2번째 행부터 기준일자(0)·회사명(1)·사용자ID(2)·사용자명(3)·이메일(4).
     * 행마다 같은 (기준일자·회사명·사용자명·사용자ID)를 지우고 넣는다. 오류가 나면 전체 롤백. 넣은 행 수를 돌려준다.
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
```

## CH-cpd-436d0e6c — 기타 로직 · 같은 도메인 · 22줄×3곳 (점수 44)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/EvalLinkSeedProvider.java:58-79`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TrTaxLinkSeedProvider.java:80-98`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TransportMngLinkSeedProvider.java:96-113`

```java
    }

    // ───── EvalTargetListHtmlData (원본 마크업 순서 그대로 — 이상한점 #89) ─────

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
```

## CH-cpd-2763ab0a — 엑셀 · 도메인 간 · 22줄×2곳 (점수 44)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: flt, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltRealTrService.java:343-364`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PaySimpleTaxService.java:168-188`

```java
    }

    /** ExcelUpload.getLongCellData — 숫자·수식 숫자는 정수로, 글자는 쉼표를 빼고 숫자면 변환 / 그 밖은 null */
    private static Long cellLong(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.FORMULA) {
            return cell.getCachedFormulaResultType() == CellType.NUMERIC ? (long) cell.getNumericCellValue() : null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
```

## CH-cpd-869ae24e — 엑셀 · 도메인 간 · 22줄×2곳 (점수 44)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, ics
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:40-61`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ics/service/IcsChecklistService.java:145-165`

```java
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.", e);
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 계좌: 관리코드(0)·계좌명(1)·계좌번호(2)·증권사명(3)·최초설정일(4)·해지일(5).
     * 증권사명은 사용 중인 증권회사(거래처구분 3)의 이름과 같아야 하고(코드는 그 거래처 것), 같은 관리코드가 이미 있으면 막는다(원본은 갱신 코드를 주석 처리).
     * 한 행이라도 오류면 전체 롤백. 등록한 건수를 돌려준다.
```

## CH-cpd-1492aea9 — 엑셀 · 도메인 간 · 22줄×2곳 (점수 44)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayAnnualService.java:241-262`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:296-317`

```java
            return str.matches("-?\\d+") ? Long.parseLong(str) : null;
        }
        return null;
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
        if (cell == null) {
            return null;
        }
        Date date;
        if (cell.getCellType() == CellType.STRING) {
```

## CH-cpd-1f98daf0 — 엑셀 · 도메인 간 · 22줄×2곳 (점수 44)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:417-438`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:296-317`

```java
            return str.matches("-?\\d+") ? Long.parseLong(str) : null;
        }
        return null;
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
        if (cell == null) {
            return null;
        }
        Date date;
        if (cell.getCellType() == CellType.STRING) {
```

## CH-cpd-ca8862da — 엑셀 · 도메인 간 · 11줄×3곳 (점수 44)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, bbs, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:99-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/bbs/service/BbsCompanyRuleService.java:271-281`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:58-68`

```java
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 기준일은 필수입력입니다.");
```

## CH-cpd-b2cd90c9 — 기타 로직 · 같은 도메인 · 42줄×2곳 (점수 42)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PayMonthLinkSeedProvider.java:80-121`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/RetireLinkSeedProvider.java:55-97`

```java
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:10px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String tdNoneSlim(int colspan, int rowspan, String align, int size, String text) {
```

## CH-cpd-ddda8b57 — 기타 로직 · 같은 파일 · 21줄×3곳 (점수 42)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:172-192`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:289-309`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:416-436`

```java
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
            
```

## CH-cpd-a6252aa6 — 기타 로직 · 같은 도메인 · 21줄×3곳 (점수 42)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TrTaxLinkSeedProvider.java:78-98`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TransportLinkSeedProvider.java:68-89`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TransportMngLinkSeedProvider.java:94-113`

```java
                + align + "; height:20px; width:" + colspan + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
```

## CH-cpd-6a25ad8a — 기타 로직 · 같은 도메인 · 21줄×3곳 (점수 42)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/DepositBookLinkSeedProvider.java:74-94`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TrTaxLinkSeedProvider.java:80-98`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TransportMngLinkSeedProvider.java:96-113`

```java
    }

    // ───── DepositIoListHtmlData ─────

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
```

## CH-cpd-321c5268 — 기타 로직 · 같은 도메인 · 21줄×3곳 (점수 42)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/OprHtml.java:41-61`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PayMonthLinkSeedProvider.java:91-114`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/RetireLinkSeedProvider.java:68-90`

```java
    private static String tdNone(int colspan, int rowspan, String align, int size, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border-style:none; border-width:2px; text-align:"
                + align + "; height:1px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px; height:15px; width:" + (colspan * 5) + "%;\">"
                + "<span></span></td>";
    }
```

## CH-cpd-7e5b4e4f — 기타 로직 · 같은 도메인 · 20줄×3곳 (점수 40)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/ErpFeeChargeLinkSeedProvider.java:53-72`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TrTaxLinkSeedProvider.java:70-89`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TransportMngLinkSeedProvider.java:86-105`

```java
        return new Seed(title, content, c.chargeDate(), false, false, c.corpName(), null);
    }

    // ───── ErpFeeChargeHtmlData ─────

    private static String tdStColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:20px; width:" + colspan + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">" + text + "</span></strong></td>";
    }

```

## CH-cpd-b2a80c97 — 엑셀 · 도메인 간 · 19줄×2곳 (점수 38)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd, kfs
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:101-119`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:102-120`

```java
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage(), e);
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
```

## CH-cpd-bbddbb67 — 기타 로직 · 같은 파일 · 37줄×2곳 (점수 37)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:246-282`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:489-525`

```java
                            tdStColor(     20,    1,    0,     "center",  12, "< 미사용 연차유급휴가 사용시기 지정 >", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart +
                            tdEmpty( 1, 1, 0) +
                            tdStColor(  6,     1,    1,     "center",     12, "해당월",        "#EAEFF4") +
                            tdStColor(  6,     1,    1,     "center",     12, "지정일자",    "#EAEFF4") +
                            tdStColor(     6,     1,    1,     "center",     12, "사용일수",    "#EAEFF4") +
                            tdEmpty( 1, 1, 0) +
                        trClose;
```

## CH-cpd-c82c823a — 기타 로직 · 같은 파일 · 31줄×2곳 (점수 31)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:69-99`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:312-342`

```java
                            tdStColor(     20,    1,    0,     "center",  20, "미사용 연차유급휴가일수 통지서", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  12, "[관련법령 : 근로기준법 제 61조]", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     3,     1,    1,     "center",     12, "성 명",        "#EAEFF4") +
                            tdColor(     3,     1,    1,     "center",     12,     checkNull(unLeaveModel.personName()), "none") +
```

## CH-cpd-d8f86158 — 기타 로직 · 같은 파일 · 30줄×2곳 (점수 30)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:167-196`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:410-439`

```java
    public static String html1_02(UnLeaveNoticeRow unLeaveModel, LocalDate date01, LocalDate date02, List<String> month, List<String> day, List<String> dayCount) {

        String text = 
                tableStart + 
                    tbodyrStart + 
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
```

## CH-cpd-a6f54125 — 엑셀 · 도메인 간 · 15줄×2곳 (점수 30)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: icam, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:103-117`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:354-368`

```java
    public int upload(UserPrincipal user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
```

## CH-cpd-e97ee286 — 엑셀 · 도메인 간 · 15줄×2곳 (점수 30)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: kfs, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:71-85`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:354-368`

```java
    public int upload(UserPrincipal user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
```

## CH-cpd-1fc400dd — 파일·업로드 · 도메인 간 · 15줄×2곳 (점수 30)

- 권고: 파일 저장/읽기 공통 서비스로
- 도메인: biz, sys
- 관련 있을 수 있는 기존 common 부품: UploadProperties
- `backend/src/main/java/kr/co/kfs/asseterp/biz/biz/controller/BizFeeChargeController.java:171-185`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sys/controller/SysFileController.java:139-153`

```java
        StreamingResponseBody body = out -> {
            try (ZipOutputStream zip = new ZipOutputStream(out)) {
                zip.setLevel(8);
                for (SysFileService.StoredFile entry : entries) {
                    ZipEntry zipEntry = new ZipEntry(entry.fileNm());
                    zipEntry.setTime(entry.file().lastModified());
                    zip.putNextEntry(zipEntry);
                    Files.copy(entry.file().toPath(), zip);
                    zip.closeEntry();
                }
            }
        };
```

## CH-cpd-fa7ff7bb — 기타 로직 · 같은 파일 · 29줄×2곳 (점수 29)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:41-69`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:284-312`

```java
    public static String html1_01(UnLeaveNoticeRow unLeaveModel, LocalDate date01, LocalDate date02) {
        String text = 
                tableStart + 
                    tbodyrStart + 
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
```

## CH-cpd-9b0e5b18 — 기타 로직 · 같은 도메인 · 29줄×2곳 (점수 29)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/DepositBookLinkSeedProvider.java:73-101`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/EvalLinkSeedProvider.java:57-86`

```java
        return new Seed("예금대사 결과보고 (" + std.format(YM) + ")", html(list, std, fxYn), null, false, false);
    }

    // ───── DepositIoListHtmlData ─────

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

```

## CH-cpd-7f737a1f — 엑셀 · 도메인 간 · 14줄×2곳 (점수 28)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:96-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndOprFundService.java:116-129`

```java
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
```

## CH-cpd-f63037d6 — 엑셀 · 도메인 간 · 14줄×2곳 (점수 28)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: crd, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/crd/service/CrdCardUploadService.java:51-64`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndOprFundService.java:116-129`

```java
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
```

## CH-cpd-c3e01c52 — 엑셀 · 도메인 간 · 14줄×2곳 (점수 28)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: icam, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icam/service/IcamUserStopService.java:104-117`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:236-249`

```java
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
```

## CH-cpd-9a8fafc9 — 엑셀 · 도메인 간 · 14줄×2곳 (점수 28)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: kfs, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:72-85`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:236-249`

```java
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
```

## CH-cpd-6279b553 — 엑셀 · 도메인 간 · 14줄×2곳 (점수 28)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: pay, sch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayInsureApplyService.java:355-368`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/sch/service/SchIpoService.java:236-249`

```java
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
```

## CH-cpd-c4153a37 — 컨트롤러 반복 · 도메인 간 · 14줄×2곳 (점수 28)

- 권고: 공통 컨트롤러 메서드/인자 해석기로
- 도메인: icr, ics
- `backend/src/main/java/kr/co/kfs/asseterp/biz/icr/controller/IcrClassTreeController.java:45-58`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ics/controller/IcsLawController.java:55-68`

```java
    public ApiResponse<PageRes<IcrClassTreeLookupRes>> searchLookup(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam(required = false) Long classTreeId,
                                                                    @RequestParam(defaultValue = "") String lawSearch,
                                                                    @RequestParam(defaultValue = "") String statuteSearch,
                                                                    @RequestParam(defaultValue = "false") boolean detailSearchYn,
                                                                    @RequestParam(defaultValue = "0") long offset,
                                                                    @RequestParam(defaultValue = "50") long limit,
                                                                    @RequestParam(required = false) String relateTable,
                                                                    @RequestParam(required = false) Long relateId) {
        return ApiResponse.ok(service.searchLookup(principal, classTreeId, lawSearch, statuteSearch, detailSearchYn, offset, limit, relateTable, relateId));
    }

```

## CH-cpd-a4b11fdb — 그리드 CUD 저장 · 같은 파일 · 26줄×2곳 (점수 26)

- 권고: AS-IS Grid* 저장 흐름(C/U/D 분기 루프) 공통 헬퍼로
- 도메인: ast
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ast/service/AstDetailService.java:37-62`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ast/service/AstDetailService.java:82-107`

```java
        requireSysAdmin(user);
        for (AstDetailSaveReq req : rows) {
            if (req.seq() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "조회순번은 필수입력 항목입니다.");
            }
            if (req.title() == null || req.title().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "항목은 필수입력 항목입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.detailId() != null && req.detailId() > 0 && mapper.selectById(req.detailId()) != null;
            if (exists) {
```

## CH-cpd-a9263dd4 — 기타 로직 · 같은 도메인 · 26줄×2곳 (점수 26)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/EtcLeaveLinkSeedProvider.java:57-82`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/RetireLinkSeedProvider.java:54-81`

```java
        return d == null ? "" : d.toString();
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:10px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

```

## CH-cpd-6674fcc1 — 기타 로직 · 같은 도메인 · 26줄×2곳 (점수 26)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/EvalLinkSeedProvider.java:58-83`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TransportLinkSeedProvider.java:70-93`

```java
    }

    // ───── EvalTargetListHtmlData (원본 마크업 순서 그대로 — 이상한점 #89) ─────

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
```

## CH-cpd-87ad430f — 기타 로직 · 도메인 간 · 13줄×2곳 (점수 26)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr, pay
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PayMonthLinkSeedProvider.java:73-85`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/pay/service/PayMonthListHtml.java:24-36`

```java
    private static String tdCreate(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:15px; width:" + (colspan * 3.3) + "%;\">"
                + "<strong><span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></strong></td>";
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
```

## CH-cpd-adc206fe — 엑셀 · 도메인 간 · 13줄×2곳 (점수 26)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvAccountUploadService.java:58-70`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:58-70`

```java
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
```

## CH-cpd-ab3c76a4 — 기타 로직 · 같은 파일 · 25줄×2곳 (점수 25)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:99-123`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:342-366`

```java
                            tdStColor(     3,     1,    1,     "center",     12, "의무사용연차<br>(B=A*"+unLeaveModel.dutyRt()+"%)",    "#EAEFF4") +
                            tdStColor(     2,     1,    1,     "center",     12, "사용휴가<br>(C)",                "#EAEFF4") +
                            tdStColor(     3,     1,    1,     "center",     12, "미사용휴가<br>(B-C)",            "#EAEFF4") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdColor(     4,     2,    1,     "center",     12,     fmt(unLeaveModel.leaveOccurStartDate()) + "부터<br>" + fmt(unLeaveModel.leaveOccurCloseDate()),    "none") +
                            tdColor(     4,     2,    1,     "center",     12,     fmt(unLeaveModel.leaveTargetStartDate()) + "부터<br>" + fmt(unLeaveModel.leaveTargetCloseDate()),    "none") +
                            tdColor(     2,     2,    1,     "center",     12,     checkDoubleNull(unLeaveModel.totalDays()),     "none") +
                            tdColor(     3,     2,    1,     "center",     12,     checkDoubleNull((unLeaveModel.totalDays()*(unLeaveModel.dutyRt()*0.01))), "none") +
                            tdColor(     2,     2,    1,     "center",     12,     checkDoubleNull(unLeaveModel.useDays()),     "none") +
```

## CH-cpd-9ca40061 — 기타 로직 · 같은 도메인 · 25줄×2곳 (점수 25)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/EtcLeaveLinkSeedProvider.java:58-82`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PayMonthLinkSeedProvider.java:80-104`

```java
    }

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String backGroundColor) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + backGroundColor + "; text-align:"
                + align + "; height:10px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">"
                + text
                + "</span></td>";
    }

    private static String tdNoneSlim(int colspan, int rowspan, String align, int size, String text) {
```

## CH-cpd-1000c918 — 기타 로직 · 같은 도메인 · 25줄×2곳 (점수 25)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/DepositBookLinkSeedProvider.java:74-98`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TransportLinkSeedProvider.java:70-93`

```java
    }

    // ───── DepositIoListHtmlData ─────

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + colspan + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
```

## CH-cpd-29f99f47 — 그리드 CUD 저장 · 같은 도메인 · 24줄×2곳 (점수 24)

- 권고: AS-IS Grid* 저장 흐름(C/U/D 분기 루프) 공통 헬퍼로
- 도메인: dcr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/dcr/service/DcrRelateIcrService.java:36-59`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/dcr/service/DcrRelateIcsService.java:37-61`

```java
        List<DcrRelateIcrRes> saved = new ArrayList<>();
        for (DcrRelateSaveReq req : rows) {
            DcrClassTreeRes tree = classTreeMapper.selectTreeRowById(req.dcrClassTreeId());
            if (tree == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (tree.companyId() == 0L) {
                for (DcrClassTreeRes copy : classTreeMapper.selectAdminCopiesByCode(tree.classTreeCode())) {
                    mapper.insert(mapper.selectNextId(), copy.classTreeId(), req.targetClassTreeId(), copy.companyId(), null);
                }
            }
            Long id = mapper.selectNextId();
```

## CH-cpd-be52b1a5 — 엑셀 · 도메인 간 · 12줄×2곳 (점수 24)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd, kfs
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndFundUploadService.java:59-70`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:75-86`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                String fundCode = cellString(row.getCell(0));
```

## CH-cpd-e3fa2984 — 엑셀 · 도메인 간 · 12줄×2곳 (점수 24)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd, kfs
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndOprFundService.java:120-131`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/kfs/service/KfsRemoteViewService.java:75-86`

```java
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                String fundCode = cellString(row.getCell(0));
```

## CH-cpd-526051e7 — 기타 로직 · 같은 도메인 · 23줄×2곳 (점수 23)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/BenefitLinkSeedProvider.java:83-105`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TrTaxLinkSeedProvider.java:143-165`

```java
        String numStr = String.valueOf(amt);
        String[] han1 = {"", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"};
        String[] han2 = {"", "십", "백", "천"};
        String[] han3 = {"", "만", "억", "조", "경"};
        StringBuilder result = new StringBuilder();
        int len = numStr.length();
        boolean hasHan3 = false;
        for (int i = len; i > 0; i--) {
            int nowInt = Integer.parseInt(numStr.substring(len - i, len - i + 1));
            int han2Pick = (i - 1) % 4;
            if (nowInt > 0) {
                result.append(han1[nowInt]).append(han2[han2Pick]);
```

## CH-cpd-370129d2 — 기타 로직 · 같은 도메인 · 22줄×2곳 (점수 22)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/FinanceBookLinkSeedProvider.java:58-79`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/OfficeAssetsLinkSeedProvider.java:62-83`

```java
        return new Seed("금융상품 보유내역_" + std.format(DATE), html(std, list), LocalDate.now(), false, false);
    }

    // ───── FinanceBookHtmlData ─────

    private static String tdStColor(int colspan, int border, String align, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg
                + "; text-align:" + align + "; height:25px; width:" + (colspan * 4.4) + "%;\"><strong><span style=\"font-size:12px;\">" + text + "</span></strong></td>";
    }

    private static String tdColor(int colspan, String align, String text) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"1\" style=\"border:1px;border-color:black; border-style:solid; border-width:1px; background-color:none; text-align:"
```

## CH-cpd-9df3f873 — 기타 로직 · 같은 파일 · 22줄×2곳 (점수 22)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:146-167`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:389-410`

```java
                            tdStColor(     19,    1,    0,     "left",     12, "추후 회사가 임의 지정할 예정이며, 그럼에도 불구하고 사용하지 아니한 연차유급휴가일수는","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "소멸하오니 이점 유념하시기 바랍니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",    16, fmtKor(date02), "#FFFFFF") +
                        trClose +
```

## CH-cpd-34435ccb — 엑셀 · 도메인 간 · 11줄×2곳 (점수 22)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: adv, car
- `backend/src/main/java/kr/co/kfs/asseterp/biz/adv/service/AdvBookExtrService.java:99-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/car/service/CarJournalUploadService.java:59-69`

```java
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 기준일은 필수입력입니다.");
```

## CH-cpd-b6ae4639 — 엑셀 · 도메인 간 · 11줄×2곳 (점수 22)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: bbs, car
- `backend/src/main/java/kr/co/kfs/asseterp/biz/bbs/service/BbsCompanyRuleService.java:271-281`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/car/service/CarJournalUploadService.java:59-69`

```java
        DataFormatter formatter = new DataFormatter();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
```

## CH-cpd-ddda8b57 — 기타 로직 · 같은 파일 · 21줄×2곳 (점수 21)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:288-308`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:416-436`

```java
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
            
```

## CH-cpd-614dd73a — 기타 로직 · 같은 도메인 · 19줄×2곳 (점수 19)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: emp
- `backend/src/main/java/kr/co/kfs/asseterp/biz/emp/service/EmpEvalGradeService.java:40-58`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/emp/service/EmpEvalListService.java:40-58`

```java
            if (row.evalGradeId() == null || row.evalGradeId() <= 0) {
                mapper.insert(mapper.selectNextId(), req.evalListStdId(), row);
            } else if (mapper.update(req.evalListStdId(), row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            count++;
        }
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) {
            mapper.deleteByIds(req.evalListStdId(), req.deleteIds());
        }
        return count;
    }
```

## CH-cpdts-95b234f8 — 기타 로직 · 같은 파일 · 19줄×2곳 (점수 19)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: fe.types
- `frontend/src/types/sch.ts:347-365`
- `frontend/src/types/sch.ts:475-493`

```typescript
  contentLimit?: string | null;
  content?: string | null;
  deadlineName?: string | null;
  deadlineId?: number | null;
  statusName?: string | null;
  personName?: string | null;
  note?: string | null;
  classId?: number | null;
  managerId?: number | null;
  managerName?: string | null;
  personId?: number | null;
  orgName?: string | null;
```

## CH-cpdts-f24d7bd1 — API 호출 · 같은 도메인 · 18줄×2곳 (점수 18)

- 권고: api/ 의 공통 함수로
- 도메인: fe.api
- `frontend/src/api/flt.ts:649-666`
- `frontend/src/api/ics.ts:8-24`

```typescript
async function downloadBlob(path: string, params: object, fileName: string): Promise<void> {
  try {
    const res = await apiClient.get<Blob>(path, { params, responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
```

## CH-cpdts-de66c98a — 기타 로직 · 같은 파일 · 17줄×2곳 (점수 17)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: fe.types
- `frontend/src/types/bizErp.ts:114-130`
- `frontend/src/types/bizErp.ts:145-161`

```typescript
  erpProductCd: string | null;
  chargeDate: string | null;
  startDate: string | null;
  closeDate: string | null;
  erpFee: number | null;
  dataFee: number | null;
  smsCount: number | null;
  addSmsFee: number | null;
  serverUsage: number | null;
  addServerFee: number | null;
  userCount: number | null;
  addUserFee: number | null;
```

## CH-cpd-fc655a38 — 기타 로직 · 같은 도메인 · 16줄×2곳 (점수 16)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: flt
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltAcntTransferService.java:82-97`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltRightsExerciseService.java:81-96`

```java
        for (AcntTransferRes row : targets) {
            insertFloorTrBook(user, new AcntTransferBookReq(row.trItemType(), row.trItemName(), row.trItemCode(), row.regDate()));
        }
        return count;
    }

    /** AS-IS insertFloorTrBook(원장생성, 종목 한정) — 함수가 'Y'가 아닌 글자를 주면 그 글자가 오류 메시지 */
    @Transactional
    public void insertFloorTrBook(UserPrincipal user, AcntTransferBookReq req) {
        String msg = mapper.insertFloorTrBookItem(user.getCompanyId(), user.getUserId(), req.trItemType(),
                req.trItemName(), req.trItemCode(), req.regDate());
        if (!"Y".equals(msg)) {
```

## CH-cpd-c4ba3202 — 기타 로직 · 같은 도메인 · 16줄×2곳 (점수 16)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/JointLeaveLinkSeedProvider.java:57-72`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/ScheduleLinkSeedProvider.java:79-94`

```java
    }

    // ───── JointLeaveHtmlData.getHtmlContent ─────

    private static String tdColor(int colspan, int rowspan, int border, String align, int size, String text, String bg) {
        return "<td colspan=\"" + colspan + "\" rowspan=\"" + rowspan
                + "\" style=\"border:" + border + "px;border-color:black; border-style:solid; border-width:1px; background-color:" + bg + "; text-align:"
                + align + "; height:25px; width:" + (colspan * 5) + "%;\">"
                + "<span style=\"font-size:" + size + "px;\">" + text + "</span></td>";
    }

    private static String tdEmpty(int colspan, int rowspan, int border) {
```

## CH-cpd-4a779d88 — 변환(Map·DTO) · 같은 도메인 · 16줄×2곳 (점수 16)

- 권고: 변환기(정적 팩토리/공통 매퍼)로
- 도메인: tdm
- `backend/src/main/java/kr/co/kfs/asseterp/biz/tdm/service/TdmTaskDetailService.java:107-122`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/tdm/service/TdmTaskDutyService.java:115-130`

```java
                ids.add(row.taskRelateDetailId());
            }
        }
        return ids.stream().map(mapper::selectById).toList();
    }

    /** AS-IS Tdm12_TaskRelateDetail.delete: 사용이력이 있으면 중단, 삭제이력을 만든 뒤 삭제 */
    @Transactional
    public int delete(UserPrincipal user, TaskDeleteReq req) {
        if (req.ids() == null || req.ids().isEmpty()) {
            return 0;
        }
```

## CH-cpd-a99fc256 — 기타 로직 · 같은 파일 · 16줄×2곳 (점수 16)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:127-142`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:370-385`

```java
                            tdStColor(     19,    1,    0,     "left",     12,    fmtKor(date01) + "까지 미사용 연차유급휴가일수의 사용 시기를 지정한 후, 제출부탁드립니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "※ 제출안내 : Asset-ERP > 신청 > 03.휴가 > 연차휴가 지정통보","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "※ 실제 휴가 사용 시 휴가신청서 별도 제출","#FFFFFF") +
```

## CH-cpdts-56f73d72 — 기타 로직 · 같은 파일 · 16줄×2곳 (점수 16)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: fe.types
- `frontend/src/types/tdm.ts:1109-1124`
- `frontend/src/types/tdm.ts:1218-1233`

```typescript
  roleName?: string | null;
  commonTypeName?: string | null;
  taskName?: string | null;
  checkItem?: string | null;
  checkCycleInfo?: string | null;
  checkHow?: string | null;
  checkEvidDocName?: string | null;
  refBasis?: string | null;
  checkerId?: number | null;
  checkerName?: string | null;
  checkDate?: string | null;
  checkResultCode?: string | null;
```

## CH-cpd-174776ad — 엑셀 · 같은 도메인 · 15줄×2곳 (점수 15)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndAccountService.java:95-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndOprFundService.java:116-130`

```java
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
```

## CH-cpd-383bd1eb — 기타 로직 · 같은 파일 · 15줄×2곳 (점수 15)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: flt
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltTrService.java:207-221`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/flt/service/FltTrService.java:232-243`

```java
            List<Object> v = new ArrayList<>(Arrays.asList(r.personOrgName(), r.inOutName(), r.trTypeName()));
            if (preTrYn) {
                v.addAll(Arrays.asList(r.regDate(), r.itemName(), r.expectTrQty(), r.expectTrAmt()));
            }
            v.addAll(Arrays.asList(r.statusName(), r.trDate(), r.trItemTypeName(), r.trItemName(), r.trQty(), r.trAmt(), r.trPlRate(), r.trNote()));
            rows.add(v);
        }
        return FltExcelWriter.write("임직원 매매내역", headers, rows);
    }

    /**
     * 엑셀다운로드 — AS-IS는 Sys99_Print.insertRdTrList + RD 리포트(Flt10_Rd_TrList)에 맡겼다. 같은 조회 결과를 그리드 열 순서로 xlsx에 쓴다.
```

## CH-cpd-c45b4d78 — 엑셀 · 같은 도메인 · 14줄×2곳 (점수 14)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndBookExtrService.java:96-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/service/FndOprFundService.java:116-129`

```java
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
```

## CH-cpd-5bdd6248 — 날짜·숫자 포맷 · 같은 도메인 · 14줄×2곳 (점수 14)

- 권고: common.util 순수 함수(포맷·파싱·반올림)로
- 도메인: batch
- `backend/src/main/java/kr/co/kfs/asseterp/biz/batch/action/IcamBookAction.java:60-73`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/batch/action/IcamItemAction.java:53-66`

```java
        log.info("ICAM 운용종목 원장 가져오기 시작 (icamBook) companyId={}, worker={}", req.companyId(), req.worker());

        LocalDate stdDate;
        if (req.stdDate() == null || req.stdDate().isEmpty()) {
            stdDate = commonMapper.selectBizDate(0L, LocalDate.now(), "-1");
        } else {
            try {
                stdDate = LocalDate.parse(req.stdDate());
            } catch (DateTimeParseException e) {
                // AS-IS는 파싱 실패를 삼키고 null로 진행한다(원본-이상한점 #214)
                throw new BusinessException(ErrorCode.INVALID_INPUT, "stdDate 형식이 맞지 않습니다(yyyy-MM-dd): " + req.stdDate(), e);
            }
```

## CH-cpd-4958a52e — 기타 로직 · 같은 파일 · 14줄×2곳 (점수 14)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:199-212`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:442-455`

```java
                            tdStColor(     20,    1,    0,     "center",  12, "< 근로기준법 제 61조(연차유급휴가의 사용촉진) 관련 >", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "1. 대상 근로자","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     2,     1,    1,     "center",     12, "성 명",        "#EAEFF4") +
```

## CH-cpd-74f286fa — 기타 로직 · 같은 파일 · 13줄×2곳 (점수 13)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:213-225`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/UnLeaveNoticeHtml.java:456-468`

```java
                            tdColor(     3,     1,    1,     "center",     12,     checkNull(unLeaveModel.orgName()), "none") +
                            tdStColor(     2,     1,    1,     "center",     12, "사 번",        "#EAEFF4") +
                            tdColor(     2,     1,    1,     "center",     12,     checkNull(unLeaveModel.personNo()), "none") +
                            tdStColor(     2,     1,    1,     "center",     12, "직 위",        "#EAEFF4") +
                            tdColor(     2,     1,    1,     "center",     12,     checkNull(unLeaveModel.posName()), "none") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
```

## CH-cpd-8552a0bb — 파일 통째 복제 · 같은 도메인 · 13줄×2곳 (점수 13)

- 권고: 같은 AS-IS 부품을 도메인마다 복사한 것 — 공통 서비스 하나로 합치고 도메인은 위임
- 도메인: fnd
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/dto/FundRes.java:6-18`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/fnd/dto/FundSearchRes.java:6-18`

```java
public record FundRes(
        Long fundCodeId, Long fundInfoId, String fundCode, String kofiaFundCode, String ksdFundCode, String ksdItemCode,
        String fundFullName, String fundName, String cur, Long seoljAek, Long sunjasanAek,
        LocalDate startDate, LocalDate nextCloseDate, LocalDate nextFeeDate, LocalDate endExpectDate, LocalDate endDate,
        String closeYn, String closeName, String orgCodeName, String operator1, String operator2,
        String consignmentCode, String consignmentName, String officeWorkCode, String officeWorkName,
        String trustBankCode, String trustBankName,
        String kofiaTrustCode, String kofiaTrustName, String kofiaFundTypeCode, String kofiaFundTypeName,
        String kofiaPublicCode, String kofiaPublicName, String kofiaParentCode, String kofiaParentName,
        String kofiaClassTypeCode, String kofiaClassTypeName, String kofiaFundUnitCode, String kofiaFundUnitName,
        String kofiaCharClassCode, String kofiaCharClassName,
        Double managementRate, Double salesRate, Double consignmentRate, Double officeWorkRate,
```

## CH-cpd-f1e58ff5 — 컨트롤러 반복 · 같은 도메인 · 12줄×2곳 (점수 12)

- 권고: 공통 컨트롤러 메서드/인자 해석기로
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/controller/AprRelateStampController.java:57-68`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/controller/AprStampDocController.java:134-145`

```java
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                       @RequestParam(required = false) Long stampId,
                                       @RequestParam(defaultValue = "false") boolean outYn,
                                       @RequestParam(required = false) String searchText,
                                       @RequestParam(defaultValue = "false") boolean org) {
        return ApiResponse.ok(service.insertStampListPrint(principal, startDate, closeDate, stampId, outYn, searchText, org));
    }

    /** AS-IS apr.Apr19_RelateStamp.selectById — 날인일자 수정 창이 여는 값 */
    @GetMapping("/{relateStampId}/stamp-date")
```

## CH-cpd-4047be74 — 컨트롤러 반복 · 같은 도메인 · 11줄×2곳 (점수 11)

- 권고: 공통 컨트롤러 메서드/인자 해석기로
- 도메인: ics
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ics/controller/IcsChecklistConfirmController.java:39-49`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ics/controller/IcsChecklistStatusController.java:52-62`

```java
    public ApiResponse<PageRes<IcsChecklistConfirmRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                               @RequestParam String cycleType, @RequestParam(required = false) Long checklistLClassId,
                                                               @RequestParam(required = false) Long checklistMClassId, @RequestParam(defaultValue = "") String searchText,
                                                               @RequestParam boolean unCheckYn, @RequestParam boolean unConfirmYn,
                                                               @RequestParam int offset, @RequestParam int limit) {
        return ApiResponse.ok(service.search(principal, stdDate, cycleType, checklistLClassId, checklistMClassId, searchText, unCheckYn, unConfirmYn, offset, limit));
    }

    /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdChecklistConfirm + RD 리포트 Ics15_Rd_ChecklistConfirm → 한 시트 xlsx) */
    @GetMapping("/excel")
```

## CH-cpd-d50f7590 — 기타 로직 · 같은 도메인 · 11줄×2곳 (점수 11)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: tdm
- `backend/src/main/java/kr/co/kfs/asseterp/biz/tdm/service/RdCheckExctPdfMaker.java:99-109`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/tdm/service/RdManlOrgPdfMaker.java:88-97`

```java
    }

    /** RD 서버가 안 열리거나 오류면 null (AS-IS는 RD 콜백이 실패 문구를 줄 때와 같이 취급) */
    private String post(String url) {
        try {
            HttpResponse<String> res = http.send(
                    HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(60)).POST(HttpRequest.BodyPublishers.noBody()).build(),
                    HttpResponse.BodyHandlers.ofString());
            return res.statusCode() / 100 == 2 ? res.body().trim() : "HTTP " + res.statusCode();
        } catch (IOException e) {
            log.error("RD 서버 호출 실패 url={}", rdProperties.url(), e);
```

## CH-cpd-3cd163eb — 컨트롤러 반복 · 같은 도메인 · 11줄×2곳 (점수 11)

- 권고: 공통 컨트롤러 메서드/인자 해석기로
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/controller/AprRelateStampController.java:81-91`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/controller/AprStampDocController.java:158-168`

```java
    public ApiResponse<List<AprRelateStampCheckRes>> searchStampCheck(@AuthenticationPrincipal UserPrincipal principal,
                                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                      @RequestParam(required = false) Long stampId,
                                                                      @RequestParam(defaultValue = "false") boolean notStampFileYn) {
        return ApiResponse.ok(service.searchStampCheck(principal, startDate, closeDate, stampId, notStampFileYn));
    }

    /** AS-IS apr.Apr19_RelateStamp.update — [확인]·[확인취소] */
    @PutMapping("/confirm")
    public ApiResponse<Integer> confirm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AprRelateStampConfirmReq req) {
```

## CH-cpd-31e68768 — 엑셀 · 같은 파일 · 9줄×2곳 (점수 9)

- 권고: 엑셀 읽기/쓰기 빌더로 (common 에 엑셀 부품)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/AprApprService.java:266-274`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/AprApprService.java:310-318`

```java
            for (AprMyRequestRes a : rows) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(a.regDate() == null ? "" : a.regDate().format(fmt));
                row.createCell(1).setCellValue(a.effectDate() == null ? "" : a.effectDate().format(fmt));
                row.createCell(2).setCellValue(nvl(a.statusName()));
                row.createCell(3).setCellValue(nvl(a.classTreeName()));
                row.createCell(4).setCellValue(nvl(a.inOutTypeName()));
                row.createCell(5).setCellValue(nvl(a.title()).replaceAll("<[^>]+>", ""));
                row.createCell(6).setCellValue(nvl(a.preconfirmStatusName()));
```

## CH-cpd-efceb694 — 기타 로직 · 같은 파일 · 9줄×2곳 (점수 9)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PayMonthLinkSeedProvider.java:151-159`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PayMonthLinkSeedProvider.java:171-179`

```java
        for (PayItemAmtRow m : monthList3) {
            text.append(TR_START).append(tdEmpty(2, 1, 0))
                    .append(tdColor(5, 1, 1, "center", 14, checkNull(m.itemName()), "none"))
                    .append(tdColor(5, 1, 1, "right", 14, checkLongNull(m.itemAmt()), "none"))
                    .append(tdColor(5, 1, 1, "left", 14, checkNull(" "), "none"))
                    .append(TR_CLOSE);
        }
        text.append(TR_START).append(tdEmpty(2, 1, 0))
                .append(tdCreate(5, 1, 1, "center", 14, "지급액 합계", "#F2F2F2"))
```

## CH-cpd-9fdc87b4 — 컨트롤러 반복 · 같은 도메인 · 9줄×2곳 (점수 9)

- 권고: 공통 컨트롤러 메서드/인자 해석기로
- 도메인: ics
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ics/controller/IcsChecklistConfirmController.java:49-57`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ics/controller/IcsChecklistStatusController.java:62-70`

```java
    @GetMapping("/excel")
    public ResponseEntity<byte[]> download(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                           @RequestParam String cycleType, @RequestParam(required = false) Long checklistLClassId,
                                           @RequestParam(required = false) Long checklistMClassId, @RequestParam(defaultValue = "") String searchText,
                                           @RequestParam boolean unCheckYn, @RequestParam boolean unConfirmYn,
                                           @RequestParam(required = false) String fileName) {
        byte[] body = service.download(principal, stdDate, cycleType, checklistLClassId, checklistMClassId, searchText, unCheckYn, unConfirmYn);
        String name = (fileName == null || fileName.isBlank() ? "내부통제내역 확인(" + stdDate + ")" : fileName) + ".xlsx";
```

## CH-cpd-a7d937dd — 컨트롤러 반복 · 같은 파일 · 9줄×2곳 (점수 9)

- 권고: 공통 컨트롤러 메서드/인자 해석기로
- 도메인: ast
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ast/controller/AstFinanceOprController.java:49-57`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ast/controller/AstFinanceOprController.java:80-88`

```java
    public ApiResponse<List<FinanceOprRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                   @RequestParam(defaultValue = "") String searchText,
                                                   @RequestParam(defaultValue = "") String investAssetType,
                                                   @RequestParam(defaultValue = "false") boolean holdYn,
                                                   @RequestParam(defaultValue = "0") String periodType,
                                                   @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.search(principal, holdDate, searchText, investAssetType, holdYn,
```

## CH-cpd-b3999259 — 파일·업로드 · 같은 도메인 · 9줄×2곳 (점수 9)

- 권고: 파일 저장/읽기 공통 서비스로
- 도메인: scm
- 관련 있을 수 있는 기존 common 부품: UploadProperties
- `backend/src/main/java/kr/co/kfs/asseterp/biz/scm/service/ScmDevProgramService.java:80-88`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/scm/service/ScmProgramService.java:80-88`

```java
    public int multiUpload(UserPrincipal user, Long devId, boolean deployTgtYn, String systemCd, String programType, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "업로드 파일 없음");
        int count = 0;
        for (MultipartFile file : files) {
            String name = file == null ? null : file.getOriginalFilename();
            if (file == null || file.isEmpty() || name == null) continue;
            int dot = name.lastIndexOf('.');
            String programCd = dot < 0 ? name : name.substring(0, dot);
            long programId = mapper.selectNextId();
```

## CH-cpd-f6a83cb9 — 그리드 CUD 저장 · 같은 파일 · 9줄×2곳 (점수 9)

- 권고: AS-IS Grid* 저장 흐름(C/U/D 분기 루프) 공통 헬퍼로
- 도메인: ast
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ast/service/AstTrCodeService.java:68-76`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ast/service/AstTrCodeService.java:105-113`

```java
        for (TrCodeSaveReq req : rows) {
            boolean isNew = req.trCodeId() == null || req.trCodeId() <= 0;
            Long sameCodeId = mapper.checkTrCode(user.getCompanyId(), req.trCode());
            if (sameCodeId != null && (isNew || !sameCodeId.equals(req.trCodeId()))) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "동일한 거래코드가 존재합니다. 확인하여 주십시오. (거래코드:" + req.trCode() + ")");
            }
            Long id = isNew ? mapper.selectNextId() : req.trCodeId();
            if (isNew) {
                mapper.insert(id, user.getCompanyId(), req);
```

## CH-cpd-70f49e36 — 기타 로직 · 같은 파일 · 8줄×2곳 (점수 8)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PromoHtml.java:78-85`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PromoHtml.java:93-100`

```java
                .append(row(tdHead(8, 1, 1, "center", 14, "카드명(사원)", "#EAEFF4"), tdHead(4, 1, 1, "center", 14, "사용금액(원)", "#EAEFF4"),
                        tdHead(8, 1, 1, "center", 14, "비고", "#EAEFF4")));
        if (promoList.isEmpty()) {
            t.append(row(td(8, 1, 1, "center", 14, "- "), td(4, 1, 1, "center", 14, "- "), td(8, 1, 1, "center", 14, "- ")))
                    .append(row(tdStrong(8, 1, 1, "center", 14, "합계"), tdStrong(4, 1, 1, "center", 14, "- "), td(8, 1, 1, "center", 14, " ")));
        } else {
            long sum = 0;
            for (BizCardHtmlRow c : titleList) {
```

## CH-cpd-f9998a91 — 기타 로직 · 같은 파일 · 7줄×2곳 (점수 7)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: car
- `backend/src/main/java/kr/co/kfs/asseterp/biz/car/service/CarJournalService.java:69-75`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/car/service/CarJournalService.java:110-116`

```java
        if (req.mileage() == null || req.mileage() == 0L) throw new BusinessException(ErrorCode.INVALID_INPUT, "주행거리는 필수입력 항목입니다");
        if (req.bizMileage() != null && req.bizMileage() != 0L) {
            if (isBlank(req.destination())) throw new BusinessException(ErrorCode.INVALID_INPUT, "일반업무용은 행선지가 필수입력 항목입니다");
            if (isBlank(req.reason())) throw new BusinessException(ErrorCode.INVALID_INPUT, "일반업무용은 목적이 필수입력 항목입니다");
        }
        Long companyId = user.getCompanyId();
        if (req.infoId() == null || infoMapper.selectById(companyId, req.infoId()) == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
```

## CH-cpd-2cb3f4e4 — 기타 로직 · 같은 파일 · 7줄×2곳 (점수 7)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/FundPriceModiLinkSeedProvider.java:297-303`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/FundPriceModiLinkSeedProvider.java:315-321`

```java
        t.append(TR_START).append(td(22, 1, 1, "left", 14, 90, "- 재발 방지 대책<br>" + checkNull(m.prevPlan()))).append(TR_CLOSE);
        t.append(TR_START).append(td(22, 1, 1, "left", 14, "- 기준가 변경 공시 유무 ")).append(TR_CLOSE);
        t.append(TR_START)
                .append(td(3, 1, 1, "center", 14, "예탁원", HEAD))
                .append(td(3, 1, 1, "center", 14, checkBoolean(m.ksdNoticeYn())))
                .append(td(4, 1, 1, "center", 14, "금융투자협회", HEAD))
                .append(td(4, 1, 1, "center", 14, checkBoolean(m.kofiaNoticeYn())))
```

## CH-cpd-03a22f3b — 기타 로직 · 같은 도메인 · 7줄×2곳 (점수 7)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/ExpenseLinkSeedProvider.java:239-245`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/TrTaxLinkSeedProvider.java:174-180`

```java
        t.append(TABLE_START).append("<tbody>")
                .append(tr(tdStNoneStrong(100, 1, "center", 25, "지 출 결 의 서")))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "1. 발생부서 : " + orgName)))
                .append(tr(tdEmpty(100, 1, 0)))
                .append(tr(tdStNone(100, 1, "left", 13, "2. 계정과목 : " + accountName)))
```

## CH-cpd-26a64a3c — 기타 로직 · 같은 파일 · 6줄×2곳 (점수 6)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: apr
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PayIncomeTaxLinkSeedProvider.java:270-275`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/apr/service/link/PayIncomeTaxLinkSeedProvider.java:282-287`

```java
                .append(tdBorderColor(32, 1, 1, 1, 0, 0, "left", 12, "발급일 현재 위와 같이 원천징수하였음을 확인하여 주시기 바랍니다."))
                .append(TR_CLOSE);
        t.append(TR_START).append(tdBorderColor(34, 1, 0, 1, 0, 1, "center", 12, checkDateKorNull(m.date25()))).append(TR_CLOSE);
        t.append(TR_START)
                .append(tdBorderColor(4, 1, 0, 0, 0, 1, "center", 12, " "))
                .append(tdBorderColor(10, 1, 0, 0, 0, 0, "right", 12, "신청인"))
```

## CH-cpd-28e0d20a — 기타 로직 · 같은 파일 · 5줄×2곳 (점수 5)

- 권고: 공통 메서드로 뽑을지 판단(같은 업무 규칙인지 먼저 확인)
- 도메인: car
- `backend/src/main/java/kr/co/kfs/asseterp/biz/car/service/CarBookingService.java:57-61`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/car/service/CarBookingService.java:99-103`

```java
        if (req.infoId() == null || infoMapper.selectById(user.getCompanyId(), req.infoId()) == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        if (req.personId() == null || req.startDate() == null || req.startHour() == null || req.startMin() == null
                || req.closeHour() == null || req.closeMin() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "필수 항목이 비어 있습니다");
        LocalDate closeDate = req.closeDate() == null ? req.startDate() : req.closeDate();
        if (closeDate.isBefore(req.startDate())) throw new BusinessException(ErrorCode.INVALID_INPUT, "예약종료일자를 다시 선택해주세요");
```

## CH-cpd-13318236 — 그리드 CUD 저장 · 같은 파일 · 5줄×2곳 (점수 5)

- 권고: AS-IS Grid* 저장 흐름(C/U/D 분기 루프) 공통 헬퍼로
- 도메인: ast
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ast/service/AstTrFinanceService.java:152-156`
- `backend/src/main/java/kr/co/kfs/asseterp/biz/ast/service/AstTrFinanceService.java:170-174`

```java
        int[] widths = {3000, 7000, 9000, 4000, 8000, 4000, 4000, 4000, 3000, 4000, 4000, 6000, 9000, 2000};
        List<Object[]> rows = new ArrayList<>();
        for (TrFinanceRes t : list) {
            rows.add(new Object[]{t.date() == null ? null : t.date().toString(), t.trName(), t.corpAccountName(), t.astClassName(), t.classTreeName(),
                    zero(t.qty()), zero(t.price()), zero(t.trAmt()), zero(t.fee()), zero(t.amt()),
```

## CH-cpdts-28d9be89 — API 호출 · 같은 파일 · 3줄×2곳 (점수 3)

- 권고: api/ 의 공통 함수로
- 도메인: fe.api
- `frontend/src/api/sch.ts:350-352`
- `frontend/src/api/sch.ts:497-499`

```typescript
  saveWriteGroupShares: async (writeGroupId: number, rows: Sch02Share[]): Promise<Sch02Share[]> => {
    const body = rows.map(r => ({ shareId: r.shareId > 0 ? r.shareId : null, shareCode: r.shareCode, personId: r.personId ?? null, orgId: r.orgId ?? null, startDate: r.startDate ?? null, closeDate: r.closeDate ?? null }));
    const res = await apiClient.put<ApiResponse<Sch02Share[]>>(`v1/sch/write-groups/${writeGroupId}/shares`, body);
```
