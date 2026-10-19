# pay07_retire_create

## PROCEDURE public.pay07_retire_create(IN p_person_id numeric, IN p_user_id numeric, IN p_calc_month numeric, IN p_fix_hi numeric, IN p_fix_lt numeric, IN p_fix_ei numeric)

- 반환: `-`
- 줄 수: 199

```sql
CREATE OR REPLACE PROCEDURE public.pay07_retire_create(IN p_person_id numeric, IN p_user_id numeric, IN p_calc_month numeric, IN p_fix_hi numeric, IN p_fix_lt numeric, IN p_fix_ei numeric)
 LANGUAGE plpgsql
AS $procedure$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY07 pay07_retire%ROWTYPE;
    v_APR   apr01_appr%ROWTYPE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    --  0. DATA CLEAR => 상신여부 체크는 java server단에서 체크하고 넘어옴.
    -------------------------------------------------------------------------------------
    call pay07_retire_delete(p_person_id, p_user_id);
    -------------------------------------------------------------------------------------
    --  1. 기본DATA 생성
    -------------------------------------------------------------------------------------
    v_PAY07.pay07_retire_id := f_create_seq()   ; -- KeyID
    v_PAY07.pay07_person_id := p_person_id      ; -- 사원ID
    -------------------------------------------------------------------------------------
    --  2. 사원정보 및 율정보 생성
    -------------------------------------------------------------------------------------
    SELECT emp01_company_id                                                         AS company_id
         , emp01_kor_nm                                                             AS emp_nm
         , emp01_hire_date                                                          AS hire_date
         , emp03_trans_date                                                         AS retire_date
         , CASE WHEN emp01_hire_date > TO_DATE(TO_CHAR(emp03_trans_date,'yyyy')||'0101','yyyymmdd')
                THEN emp01_hire_date
                ELSE TO_DATE(TO_CHAR(emp03_trans_date,'yyyy')||'0101','yyyymmdd') END AS calc_start_date
         , f_org_nm(emp03_org_code_id, emp03_trans_date)                            AS org_nm
         , f_cdnm('EmpPosCode', emp03_pos_cd, emp01_company_id, emp03_trans_date)   AS pos_nm
         , ( SELECT pay04_rate
               FROM pay04_formula
              WHERE pay04_company_id = emp01_company_id
                AND pay04_start_date <= emp03_trans_date
                AND pay04_formula_cd = '15' /* 15:건강보험 */
              ORDER BY pay04_start_date DESC
               LIMIT 1 )                                                            AS hi_rate
         , ( SELECT pay04_rate
               FROM pay04_formula
              WHERE pay04_company_id = emp01_company_id
                AND pay04_start_date <= emp03_trans_date
                AND pay04_formula_cd = '16' /* 16:장기요양보험 */
              ORDER BY pay04_start_date DESC
               LIMIT 1 )                                                            AS lt_rate
         , ( SELECT pay04_rate
               FROM pay04_formula
              WHERE pay04_company_id = emp01_company_id
                AND pay04_start_date <= emp03_trans_date
                AND pay04_formula_cd = '14' /* 14:고용보험 */
              ORDER BY pay04_start_date DESC
               LIMIT 1 )                                                            AS ei_rate
      INTO v_PAY07.pay07_company_id         -- 회사ID
         , v_PAY07.pay07_person_nm          -- 사원명
         , v_PAY07.pay07_hire_date          -- 입사일
         , v_PAY07.pay07_retire_date        -- 퇴사일
         , v_PAY07.pay07_calc_start_date    -- 계산시작일
         , v_PAY07.pay07_org_nm             -- 부서명
         , v_PAY07.pay07_pos_nm             -- 직위명
         , v_PAY07.pay07_hi_rate            -- 건강보험료율
         , v_PAY07.pay07_lt_rate            -- 장기요양보험료율
         , v_PAY07.pay07_ei_rate            -- 고용보험율
      FROM emp01_person
           INNER JOIN ( SELECT *
                          FROM emp03_trans
                         WHERE emp03_person_id = p_person_id
                           AND emp03_trans_cd = '900'  /* 900:퇴직 */
                         ORDER BY emp03_trans_date DESC
                         LIMIT 1 ) emp03 ON emp03_person_id = emp01_person_id
     WHERE emp01_person_id = p_person_id ;
    -------------------------------------------------------------------------------------
    --  3. 퇴직월 급여내역
    -------------------------------------------------------------------------------------
    SELECT pay02_pay_date
         , pay02_basic_pay + pay02_bonus_pay
         , pay02_meal_pay    
         , pay02_car_mt      
         , pay02_etc01_pay + pay02_etc02_pay + pay02_etc03_pay + pay02_etc04_pay
           + pay02_extend_pay + pay02_night_pay + pay02_holiday_pay
         , pay02_income_tax  
         , pay02_resident_tax
         , pay02_others01_ddc + pay02_others02_ddc
         , pay02_np_ddc
         , pay02_hi_ddc
         , pay02_lt_ddc
         , pay02_ei_ddc
         , COALESCE(pay02_hi_unsettled,0)
         , COALESCE(pay02_lt_unsettled,0)
         , COALESCE(pay02_ei_unsettled,0)
         , pay02_month_id
      INTO v_PAY07.pay07_pay_date       -- 지급일
         , v_PAY07.pay07_basic_pay      -- 기본급여
         , v_PAY07.pay07_meal_pay       -- 식대
         , v_PAY07.pay07_car_mt         -- 차량유지비
         , v_PAY07.pay07_etc_pay        -- 기타급여
         , v_PAY07.pay07_income_tax     -- 소득세
         , v_PAY07.pay07_resident_tax   -- 주민세
         , v_PAY07.pay07_others_ddc     -- 기타공제
         , v_PAY07.pay07_np_ddc         -- 당월 국민연금
         , v_PAY07.pay07_hi_ddc         -- 당월 건강보험료
         , v_PAY07.pay07_lt_ddc         -- 당월 장기요양료
         , v_PAY07.pay07_ei_ddc         -- 당월 고용보험료
         , v_PAY07.pay07_hi_unsettled   -- 미정산 건강보험료
         , v_PAY07.pay07_lt_unsettled   -- 미정산 장기요양보험료
         , v_PAY07.pay07_ei_unsettled   -- 미정산 고용보험료
         , v_PAY07.pay07_pay_month_id
      FROM pay02_month
     WHERE pay02_person_id = p_person_id
       AND pay02_pay_cd    = '03' /* 03:퇴직정산 */
     ORDER BY pay02_pay_date DESC
     LIMIT 1 ;
    -------------------------------------------------------------------------------------
    --  3. 보험료 정산 계산자료
    -------------------------------------------------------------------------------------
    SELECT total_pay
         , work_month 
         , calc_month
         , TRUNC(total_pay / work_month)                                                                                                        AS month_pay
         , TRUNC(CAST(((total_pay / work_month) * v_PAY07.pay07_hi_rate / 100) AS NUMERIC) , -1)                                                AS month_hi
         , TRUNC(CAST(((total_pay / work_month) * v_PAY07.pay07_hi_rate / 100) AS NUMERIC) , -1) * calc_month                                   AS fix_hi
         , hi_sum
         , TRUNC(CAST(((total_pay / work_month) * v_PAY07.pay07_hi_rate / 100 * v_PAY07.pay07_lt_rate / 100) AS NUMERIC) , -1)                  AS month_lt
         , TRUNC(CAST(((total_pay / work_month) * v_PAY07.pay07_hi_rate / 100 * v_PAY07.pay07_lt_rate / 100) AS NUMERIC) , -1) * calc_month     AS fix_lt
         , lt_sum
         , TRUNC(CAST((total_pay * v_PAY07.pay07_ei_rate / 100) AS NUMERIC) , -1)                                                               AS fix_ei
         , ei_sum
         , np_sum
      INTO v_PAY07.pay07_total_pay      -- 보수총액
         , v_PAY07.pay07_work_month     -- 근무월수
         , v_PAY07.pay07_calc_month     -- 정산월수
         , v_PAY07.pay07_month_pay      -- 보수월액
         , v_PAY07.pay07_month_hi       -- 월건강보험료
         , v_PAY07.pay07_fix_hi         -- 확정건강보험료
         , v_PAY07.pay07_hi_sum         -- 납부건강보험료
         , v_PAY07.pay07_month_lt       -- 월장기요양보험료
         , v_PAY07.pay07_fix_lt         -- 확정장기요양보험료
         , v_PAY07.pay07_lt_sum         -- 납부장기요양보험료
         , v_PAY07.pay07_fix_ei         -- 확정고용보험료
         , v_PAY07.pay07_ei_sum         -- 납부고용보험료
         , v_PAY07.pay07_np_sum         -- 납부국민연금
      FROM ( SELECT SUM ( pay02_basic_pay + pay02_bonus_pay
                        + pay02_etc01_pay + pay02_etc02_pay + pay02_etc03_pay + pay02_etc04_pay
                        + pay02_extend_pay + pay02_night_pay + pay02_holiday_pay )              AS total_pay
                  , SUM ( pay02_hi_ddc )                                                        AS hi_sum
                  , SUM ( pay02_lt_ddc )                                                        AS lt_sum
                  , SUM ( pay02_ei_ddc )                                                        AS ei_sum
                  , SUM ( pay02_np_ddc )                                                        AS np_sum
                  , (DATE_PART('month',v_PAY07.pay07_retire_date::date)
                     - DATE_PART('month',v_PAY07.pay07_calc_start_date::date)) + 1              AS work_month
                  , CASE WHEN COALESCE(p_calc_month,0) = 0
                         THEN (DATE_PART('month',v_PAY07.pay07_retire_date::date)
                               - DATE_PART('month',v_PAY07.pay07_calc_start_date::date)) + 1
                         ELSE p_calc_month END                                                  AS calc_month
               FROM pay02_month
                  , emp01_person
              WHERE pay02_person_id = emp01_person_id
                AND pay02_person_id = p_person_id
                AND pay02_pay_date >= v_PAY07.pay07_calc_start_date
           ) a ;
    -------------------------------------------------------------------------------------
    --  3-1. 확정보험료 입력데이터 존재시 입력데이터로 생성되도록 변경
    -------------------------------------------------------------------------------------
    -- 입력 확정건강보험료
    IF COALESCE(p_fix_hi,0) != 0 THEN
        v_PAY07.pay07_month_hi  := TRUNC(p_fix_hi / v_PAY07.pay07_calc_month, -1)                   ; -- 월 건강보험료
        v_PAY07.pay07_fix_hi    := p_fix_hi                                                         ; -- 확정 건강보험료
        v_PAY07.pay07_month_lt  := TRUNC(v_PAY07.pay07_month_hi * v_PAY07.pay07_lt_rate / 100, -1)  ; -- 월 장기요양보험료
        v_PAY07.pay07_fix_lt    := v_PAY07.pay07_month_lt * v_PAY07.pay07_calc_month                ; -- 확정 장기요양보험료
    END IF;
    -------------------------------------------------------------------------------------
    -- 입력 확정장기요양보험료
    IF COALESCE(p_fix_lt,0) != 0 THEN
        v_PAY07.pay07_month_lt  := TRUNC(p_fix_lt / v_PAY07.pay07_calc_month, -1)                   ; -- 월 장기요양보험료
        v_PAY07.pay07_fix_lt    := p_fix_lt                                                         ; -- 확정 장기요양보험료
    END IF;
    -------------------------------------------------------------------------------------
    -- 입력 확정고용보험료
    IF COALESCE(p_fix_ei,0) != 0 THEN
        v_PAY07.pay07_fix_ei    := p_fix_ei                                                         ; -- 확정 고용보험료
    END IF;
    -------------------------------------------------------------------------------------
    --  4. 정산보험료 = 확정 + 미정산 - 납부
    -------------------------------------------------------------------------------------
    v_PAY07.pay07_settle_hi := v_PAY07.pay07_fix_hi + v_PAY07.pay07_hi_unsettled - v_PAY07.pay07_hi_sum ; -- 정산건강보험료
    v_PAY07.pay07_settle_lt := v_PAY07.pay07_fix_lt + v_PAY07.pay07_lt_unsettled - v_PAY07.pay07_lt_sum ; -- 정산장기요양보험료
    v_PAY07.pay07_settle_ei := v_PAY07.pay07_fix_ei + v_PAY07.pay07_ei_unsettled - v_PAY07.pay07_ei_sum ; -- 정산고용보험료
    -------------------------------------------------------------------------------------
    INSERT INTO pay07_retire VALUES (v_PAY07.*);
    -------------------------------------------------------------------------------------
    --  5. 월급여관리(PAY02_MONTH) 퇴직정산금액 UPDATE
    -------------------------------------------------------------------------------------
    UPDATE pay02_month
       SET pay02_retire_amt = v_PAY07.pay07_settle_hi + v_PAY07.pay07_settle_lt + v_PAY07.pay07_settle_ei
         , pay02_real_pay   = pay02_real_pay - (v_PAY07.pay07_settle_hi + v_PAY07.pay07_settle_lt + v_PAY07.pay07_settle_ei)
     WHERE pay02_month_id   = v_PAY07.pay07_pay_month_id;
-----------------------------------------------------------------------------------------
END;
$procedure$
```

## PROCEDURE public.pay07_retire_create(IN p_person_id numeric, IN p_user_id numeric, IN p_calc_month numeric, IN p_fix_hi numeric, IN p_fix_lt numeric, IN p_fix_ei numeric, IN p_non_hi_yn boolean, IN p_non_lt_yn boolean, IN p_non_ei_yn boolean)

- 반환: `-`
- 줄 수: 215

```sql
CREATE OR REPLACE PROCEDURE public.pay07_retire_create(IN p_person_id numeric, IN p_user_id numeric, IN p_calc_month numeric, IN p_fix_hi numeric, IN p_fix_lt numeric, IN p_fix_ei numeric, IN p_non_hi_yn boolean, IN p_non_lt_yn boolean, IN p_non_ei_yn boolean)
 LANGUAGE plpgsql
AS $procedure$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY07 pay07_retire%ROWTYPE;
    v_APR   apr01_appr%ROWTYPE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    --  0. DATA CLEAR => 상신여부 체크는 java server단에서 체크하고 넘어옴.
    -------------------------------------------------------------------------------------
    call pay07_retire_delete(p_person_id, p_user_id);
    -------------------------------------------------------------------------------------
    --  1. 기본DATA 생성
    -------------------------------------------------------------------------------------
    v_PAY07.pay07_retire_id := f_create_seq()   ; -- KeyID
    v_PAY07.pay07_person_id := p_person_id      ; -- 사원ID
    -------------------------------------------------------------------------------------
    --  2. 사원정보 및 율정보 생성
    -------------------------------------------------------------------------------------
    SELECT emp01_company_id                                                         AS company_id
         , emp01_kor_nm                                                             AS emp_nm
         , emp01_hire_date                                                          AS hire_date
         , emp03_trans_date                                                         AS retire_date
         , CASE WHEN emp01_hire_date > TO_DATE(TO_CHAR(emp03_trans_date,'yyyy')||'0101','yyyymmdd')
                THEN emp01_hire_date
                ELSE TO_DATE(TO_CHAR(emp03_trans_date,'yyyy')||'0101','yyyymmdd') END AS calc_start_date
         , f_org_nm(emp03_org_code_id, emp03_trans_date)                            AS org_nm
         , f_cdnm('EmpPosCode', emp03_pos_cd, emp01_company_id, emp03_trans_date)   AS pos_nm
         , ( SELECT pay04_rate
               FROM pay04_formula
              WHERE pay04_company_id = emp01_company_id
                AND pay04_start_date <= emp03_trans_date
                AND pay04_formula_cd = '15' /* 15:건강보험 */
              ORDER BY pay04_start_date DESC
               LIMIT 1 )                                                            AS hi_rate
         , ( SELECT pay04_rate
               FROM pay04_formula
              WHERE pay04_company_id = emp01_company_id
                AND pay04_start_date <= emp03_trans_date
                AND pay04_formula_cd = '16' /* 16:장기요양보험 */
              ORDER BY pay04_start_date DESC
               LIMIT 1 )                                                            AS lt_rate
         , ( SELECT pay04_rate
               FROM pay04_formula
              WHERE pay04_company_id = emp01_company_id
                AND pay04_start_date <= emp03_trans_date
                AND pay04_formula_cd = '14' /* 14:고용보험 */
              ORDER BY pay04_start_date DESC
               LIMIT 1 )                                                            AS ei_rate
      INTO v_PAY07.pay07_company_id         -- 회사ID
         , v_PAY07.pay07_person_nm          -- 사원명
         , v_PAY07.pay07_hire_date          -- 입사일
         , v_PAY07.pay07_retire_date        -- 퇴사일
         , v_PAY07.pay07_calc_start_date    -- 계산시작일
         , v_PAY07.pay07_org_nm             -- 부서명
         , v_PAY07.pay07_pos_nm             -- 직위명
         , v_PAY07.pay07_hi_rate            -- 건강보험료율
         , v_PAY07.pay07_lt_rate            -- 장기요양보험료율
         , v_PAY07.pay07_ei_rate            -- 고용보험율
      FROM emp01_person
           INNER JOIN ( SELECT *
                          FROM emp03_trans
                         WHERE emp03_person_id = p_person_id
                           AND emp03_trans_cd = '900'  /* 900:퇴직 */
                         ORDER BY emp03_trans_date DESC
                         LIMIT 1 ) emp03 ON emp03_person_id = emp01_person_id
     WHERE emp01_person_id = p_person_id ;
    -------------------------------------------------------------------------------------
    --  3. 퇴직월 급여내역
    -------------------------------------------------------------------------------------
    SELECT pay02_pay_date
         , pay02_basic_pay + pay02_bonus_pay
         , pay02_meal_pay    
         , pay02_car_mt      
         , pay02_etc01_pay + pay02_etc02_pay + pay02_etc03_pay + pay02_etc04_pay
           + pay02_extend_pay + pay02_night_pay + pay02_holiday_pay
         , pay02_income_tax  
         , pay02_resident_tax
         , pay02_others01_ddc + pay02_others02_ddc
         , pay02_np_ddc
         , pay02_hi_ddc
         , pay02_lt_ddc
         , pay02_ei_ddc
         , COALESCE(pay02_hi_unsettled,0)
         , COALESCE(pay02_lt_unsettled,0)
         , COALESCE(pay02_ei_unsettled,0)
         , pay02_month_id
      INTO v_PAY07.pay07_pay_date       -- 지급일
         , v_PAY07.pay07_basic_pay      -- 기본급여
         , v_PAY07.pay07_meal_pay       -- 식대
         , v_PAY07.pay07_car_mt         -- 차량유지비
         , v_PAY07.pay07_etc_pay        -- 기타급여
         , v_PAY07.pay07_income_tax     -- 소득세
         , v_PAY07.pay07_resident_tax   -- 주민세
         , v_PAY07.pay07_others_ddc     -- 기타공제
         , v_PAY07.pay07_np_ddc         -- 당월 국민연금
         , v_PAY07.pay07_hi_ddc         -- 당월 건강보험료
         , v_PAY07.pay07_lt_ddc         -- 당월 장기요양료
         , v_PAY07.pay07_ei_ddc         -- 당월 고용보험료
         , v_PAY07.pay07_hi_unsettled   -- 미정산 건강보험료
         , v_PAY07.pay07_lt_unsettled   -- 미정산 장기요양보험료
         , v_PAY07.pay07_ei_unsettled   -- 미정산 고용보험료
         , v_PAY07.pay07_pay_month_id
      FROM pay02_month
     WHERE pay02_person_id = p_person_id
       AND pay02_pay_cd    = '03' /* 03:퇴직정산 */
     ORDER BY pay02_pay_date DESC
     LIMIT 1 ;
    -------------------------------------------------------------------------------------
    --  3. 보험료 정산 계산자료
    -------------------------------------------------------------------------------------
    SELECT total_pay
         , work_month 
         , calc_month
         , TRUNC(total_pay / work_month)                                                                                                        AS month_pay
         , TRUNC(CAST(((total_pay / work_month) * v_PAY07.pay07_hi_rate / 100) AS NUMERIC) , -1)                                                AS month_hi
         , TRUNC(CAST(((total_pay / work_month) * v_PAY07.pay07_hi_rate / 100) AS NUMERIC) , -1) * calc_month                                   AS fix_hi
         , hi_sum
         , TRUNC(CAST(((total_pay / work_month) * v_PAY07.pay07_hi_rate / 100 * v_PAY07.pay07_lt_rate / 100) AS NUMERIC) , -1)                  AS month_lt
         , TRUNC(CAST(((total_pay / work_month) * v_PAY07.pay07_hi_rate / 100 * v_PAY07.pay07_lt_rate / 100) AS NUMERIC) , -1) * calc_month     AS fix_lt
         , lt_sum
         , TRUNC(CAST((total_pay * v_PAY07.pay07_ei_rate / 100) AS NUMERIC) , -1)                                                               AS fix_ei
         , ei_sum
         , np_sum
      INTO v_PAY07.pay07_total_pay      -- 보수총액
         , v_PAY07.pay07_work_month     -- 근무월수
         , v_PAY07.pay07_calc_month     -- 정산월수
         , v_PAY07.pay07_month_pay      -- 보수월액
         , v_PAY07.pay07_month_hi       -- 월건강보험료
         , v_PAY07.pay07_fix_hi         -- 확정건강보험료
         , v_PAY07.pay07_hi_sum         -- 납부건강보험료
         , v_PAY07.pay07_month_lt       -- 월장기요양보험료
         , v_PAY07.pay07_fix_lt         -- 확정장기요양보험료
         , v_PAY07.pay07_lt_sum         -- 납부장기요양보험료
         , v_PAY07.pay07_fix_ei         -- 확정고용보험료
         , v_PAY07.pay07_ei_sum         -- 납부고용보험료
         , v_PAY07.pay07_np_sum         -- 납부국민연금
      FROM ( SELECT SUM ( pay02_basic_pay + pay02_bonus_pay
                        + pay02_etc01_pay + pay02_etc02_pay + pay02_etc03_pay + pay02_etc04_pay
                        + pay02_extend_pay + pay02_night_pay + pay02_holiday_pay )              AS total_pay
                  , SUM ( pay02_hi_ddc )                                                        AS hi_sum
                  , SUM ( pay02_lt_ddc )                                                        AS lt_sum
                  , SUM ( pay02_ei_ddc )                                                        AS ei_sum
                  , SUM ( pay02_np_ddc )                                                        AS np_sum
                  , (DATE_PART('month',v_PAY07.pay07_retire_date::date)
                     - DATE_PART('month',v_PAY07.pay07_calc_start_date::date)) + 1              AS work_month
                  , CASE WHEN COALESCE(p_calc_month,0) = 0
                         THEN (DATE_PART('month',v_PAY07.pay07_retire_date::date)
                               - DATE_PART('month',v_PAY07.pay07_calc_start_date::date)) + 1
                         ELSE p_calc_month END                                                  AS calc_month
               FROM pay02_month
                  , emp01_person
              WHERE pay02_person_id = emp01_person_id
                AND pay02_person_id = p_person_id
                AND pay02_pay_date >= v_PAY07.pay07_calc_start_date
           ) a ;
    -------------------------------------------------------------------------------------
    --  3-1. 확정보험료 입력데이터 존재시 입력데이터로 생성되도록 변경
    -------------------------------------------------------------------------------------
    -- 입력 확정건강보험료
    IF p_non_hi_yn THEN
        v_PAY07.pay07_month_hi  := 0 ; -- 월 건강보험료
        v_PAY07.pay07_fix_hi    := 0 ; -- 확정 건강보험료
        v_PAY07.pay07_month_lt  := 0 ; -- 월 장기요양보험료
        v_PAY07.pay07_fix_lt    := 0 ; -- 확정 장기요양보험료
    ELSE
        IF COALESCE(p_fix_hi,0) != 0 THEN
            v_PAY07.pay07_month_hi  := TRUNC(p_fix_hi / v_PAY07.pay07_calc_month, -1)                   ; -- 월 건강보험료
            v_PAY07.pay07_fix_hi    := p_fix_hi                                                         ; -- 확정 건강보험료
            v_PAY07.pay07_month_lt  := TRUNC(v_PAY07.pay07_month_hi * v_PAY07.pay07_lt_rate / 100, -1)  ; -- 월 장기요양보험료
            v_PAY07.pay07_fix_lt    := v_PAY07.pay07_month_lt * v_PAY07.pay07_calc_month                ; -- 확정 장기요양보험료
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    -- 입력 확정장기요양보험료
    IF p_non_lt_yn THEN
        v_PAY07.pay07_month_lt  := 0 ; -- 월 장기요양보험료
        v_PAY07.pay07_fix_lt    := 0 ; -- 확정 장기요양보험료
    ELSE
        IF COALESCE(p_fix_lt,0) != 0 THEN
            v_PAY07.pay07_month_lt  := TRUNC(p_fix_lt / v_PAY07.pay07_calc_month, -1)                   ; -- 월 장기요양보험료
            v_PAY07.pay07_fix_lt    := p_fix_lt                                                         ; -- 확정 장기요양보험료
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    -- 입력 확정고용보험료
    IF p_non_ei_yn THEN
        v_PAY07.pay07_fix_ei := 0 ; -- 확정 고용보험료
    ELSE
        IF COALESCE(p_fix_ei,0) != 0 THEN
            v_PAY07.pay07_fix_ei := p_fix_ei                                                            ; -- 확정 고용보험료
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    --  4. 정산보험료 = 확정 + 미정산 - 납부
    -------------------------------------------------------------------------------------
    v_PAY07.pay07_settle_hi := v_PAY07.pay07_fix_hi + v_PAY07.pay07_hi_unsettled - v_PAY07.pay07_hi_sum ; -- 정산건강보험료
    v_PAY07.pay07_settle_lt := v_PAY07.pay07_fix_lt + v_PAY07.pay07_lt_unsettled - v_PAY07.pay07_lt_sum ; -- 정산장기요양보험료
    v_PAY07.pay07_settle_ei := v_PAY07.pay07_fix_ei + v_PAY07.pay07_ei_unsettled - v_PAY07.pay07_ei_sum ; -- 정산고용보험료
    -------------------------------------------------------------------------------------
    INSERT INTO pay07_retire VALUES (v_PAY07.*);
    -------------------------------------------------------------------------------------
    --  5. 월급여관리(PAY02_MONTH) 퇴직정산금액 UPDATE
    -------------------------------------------------------------------------------------
    UPDATE pay02_month
       SET pay02_retire_amt = v_PAY07.pay07_settle_hi + v_PAY07.pay07_settle_lt + v_PAY07.pay07_settle_ei
         , pay02_real_pay   = pay02_real_pay - (v_PAY07.pay07_settle_hi + v_PAY07.pay07_settle_lt + v_PAY07.pay07_settle_ei)
     WHERE pay02_month_id   = v_PAY07.pay07_pay_month_id;
-----------------------------------------------------------------------------------------
END;
$procedure$
```
