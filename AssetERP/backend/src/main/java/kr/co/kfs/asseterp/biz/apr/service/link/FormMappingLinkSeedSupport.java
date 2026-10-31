package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.com.dto.FormMappingMultiRes;
import kr.co.kfs.asseterp.biz.com.dto.FormMappingRes;
import kr.co.kfs.asseterp.biz.com.mapper.ComFormMappingMapper;
import kr.co.kfs.asseterp.biz.com.mapper.ComFormMappingMultiMapper;
import lombok.RequiredArgsConstructor;

/**
 * 치환형 링크 문서의 공통 뼈대 (AS-IS Apr01_Edit_ApprDoc.insertLinkApproval 의 `com.Com10_FormMapping.selectByLinkCode` 가지, V22).
 * 링크코드에 지정된 양식(`com10_form_mapping`)의 본문에서 `#{키}`를 호출 화면이 만든 값으로 바꾼다.
 * 양식이 없으면 null — 서비스가 문서분류의 대표 양식을 쓴다(checkContent).
 */
@Component
@RequiredArgsConstructor
public class FormMappingLinkSeedSupport {

    private static final DateTimeFormatter YYMMDD = DateTimeFormatter.ofPattern("yyMMdd");

    private final ComFormMappingMapper formMappingMapper;
    private final ComFormMappingMultiMapper formMappingMultiMapper;

    /** 양식 본문에 치환 값을 넣는다. AS-IS는 `replaceAll("#{" + key + "}", value)`이고 TOBE는 글자 그대로 바꾼다 */
    public String fill(Long companyId, String linkCode, Map<String, String> mapping) {
        List<FormMappingRes> forms = formMappingMapper.selectByLinkCode(companyId, linkCode);
        if (forms.isEmpty() || forms.get(0).content() == null) {
            return null;
        }
        String content = forms.get(0).content();
        for (Map.Entry<String, String> e : mapping.entrySet()) {
            content = content.replace("#{" + e.getKey() + "}", e.getValue());
        }
        return content;
    }

    /**
     * 상세코드별 양식 (AS-IS `com.Com11_FormMappingMulti.selectByDetailCode`, V21 A60·A61) — 같은 치환, 양식이 없으면 null.
     * kindCode는 시스템 코드 종류(예: EstPfFeeCode), detailCode는 그 상세코드(수수료 코드)
     */
    public String fillMulti(Long companyId, String kindCode, String detailCode, String linkCode, Map<String, String> mapping) {
        FormMappingMultiRes form = formMappingMultiMapper.selectByDetailCode(companyId, kindCode, detailCode, linkCode);
        if (form == null || form.content() == null) {
            return null;
        }
        String content = form.content();
        for (Map.Entry<String, String> e : mapping.entrySet()) {
            content = content.replace("#{" + e.getKey() + "}", e.getValue());
        }
        return content;
    }

    /** checkStringNull — 비었으면 "- " */
    public static String str(String text) {
        return text == null ? "- " : text;
    }

    /** 호출 화면의 날짜 도우미 (checkDateNull / checkDate01Null / checkDate02Null) — 비었으면 "- " */
    public static String date(LocalDate d, boolean yymmdd) {
        if (d == null) {
            return "- ";
        }
        return yymmdd ? d.format(YYMMDD) : d.toString();
    }
}
