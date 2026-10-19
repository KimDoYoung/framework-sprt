# f_password_rule

## FUNCTION public.f_password_rule(p_pwd character varying)

- 반환: `character varying`
- 줄 수: 98

```sql
CREATE OR REPLACE FUNCTION public.f_password_rule(p_pwd character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_pwd           SYS25_PASSWORD.SYS25_PWD%TYPE;
    v_msg           VARCHAR(100) := 'N';

    v_length        NUMERIC := 0;    -- 길이
    v_complty_a     NUMERIC := 0;    -- 복잡도 영문대문자
    v_complty_b     NUMERIC := 0;    -- 복잡도 영문소문자
    v_complty_c     NUMERIC := 0;    -- 복잡도 숫자
    v_complty_d     NUMERIC := 0;    -- 복잡도 사용가능한 특수문자
    v_complty       VARCHAR(1);
    
    v_char          CHAR(1);
    v_ascii         NUMERIC;
    v_ascii_chk     NUMERIC;
    v_recnt         NUMERIC;    -- 반복문자
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_pwd     := p_pwd;
    v_recnt   := 0;
    v_complty := 'N';
    -------------------------------------------------------------------------------------
    v_length := LENGTH(v_pwd);
    IF v_length < 8 THEN
        v_msg := '비밀번호는 8자리 이상으로 설정해야 합니다.';
        RETURN v_msg;
    END IF;
    IF v_length > 50 THEN
        v_msg := '비밀번호는 50자리 이하로 설정해야 합니다.';
        RETURN v_msg;
    END IF;
    -------------------------------------------------------------------------------------
    FOR v_cnt IN 1 .. v_length LOOP
        ---------------------------------------------------------------------------------
        v_char  := SUBSTR(v_pwd, v_cnt, 1);
        v_ascii := ASCII(v_char);
        --RAISE NOTICE 'CHAR, ASCII : % - %', v_char, v_ascii;
        ---------------------------------------------------------------------------------
        IF v_ascii < 33 AND v_ascii > 126 THEN
            v_msg := '사용할 수 없는 문자가 포함되어 있습니다.';
            RETURN v_msg;
        END IF;
        ---------------------------------------------------------------------------------
        IF    v_ascii BETWEEN 65 AND  90 THEN v_complty_a := 1; -- 영문대문자
        ELSIF v_ascii BETWEEN 97 AND 122 THEN v_complty_b := 1; -- 영문소문자
        ELSIF v_ascii BETWEEN 48 AND  57 THEN v_complty_c := 1; -- 숫자
        ELSE                                  v_complty_d := 1; -- 사용가능한 특수문자
        END IF;
        --RAISE NOTICE '복잡도 - %,%,%,%', v_complty_a, v_complty_b, v_complty_c, v_complty_d;
        ---------------------------------------------------------------------------------
        IF v_ascii = v_ascii_chk THEN
            v_recnt := v_recnt + 1;
        ELSE
            v_recnt := 0;
        END IF;
        IF v_recnt = 3 THEN
            v_msg := '반복문자는 2회로 제한됩니다.';
            RETURN v_msg;
        END IF;
        v_ascii_chk := v_ascii;
        ---------------------------------------------------------------------------------
    END LOOP;
    -------------------------------------------------------------------------------------
    -- 복잡도 체크
    CASE (v_complty_a + v_complty_b + v_complty_c + v_complty_d)
        WHEN 1 THEN
            RAISE NOTICE '복잡도 1';
            v_complty := 'N';
        WHEN 2 THEN
            RAISE NOTICE '복잡도 2 - 길이체크:%', v_length;
            IF v_length >= 10 THEN
                v_complty := 'Y';
            ELSE
                v_complty := 'N';
            END IF;
        ELSE
            v_complty := 'Y';
    END CASE;
    -------------------------------------------------------------------------------------
    IF v_complty != 'Y' THEN
        v_msg := '비밀번호는 (영문+숫자, 길이 10자리 이상) 또는 (영문+숫자+특수문자, 길이 8자리 이상)이어야 합니다.';
        RETURN v_msg;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - (%)', SQLERRM ;
    RETURN null;
END;
$function$
```
