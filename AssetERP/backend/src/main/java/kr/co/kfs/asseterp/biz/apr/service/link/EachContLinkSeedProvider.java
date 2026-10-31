package kr.co.kfs.asseterp.biz.apr.service.link;

import static kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport.str;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizEachContLinkRow;
import kr.co.kfs.asseterp.biz.biz.mapper.BizEachContMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * C01 계약사관리(개별계약서) (Apr01_Edit_ApprDoc.insertLinkApproval L2614-2649, 호출 Biz16_TabPage_EachCont.createMapping L434-454).
 * 제목 `계약사명(주) 일반사무관리 업무위탁 개별계약의 건`(읽기전용), 본문 = 연결 양식(C01)의 `#{키}`를 계약 값으로 치환(양식이 없으면 대표 양식). refId = 개별계약서 ID.
 * 호출 화면(Biz16_TabPage_EachCont)이 TOBE에 없어 제공자만 만든다 — 단추 연결(`biz.Biz16_EachCont.updateApprId` 포함)은 그 화면을 변환할 때.
 */
@Component
@RequiredArgsConstructor
public class EachContLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter KOR_DATE = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

    private final BizEachContMapper mapper;
    private final FormMappingLinkSeedSupport formSupport;

    @Override
    public Set<String> linkCodes() {
        return Set.of("C01");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        BizEachContLinkRow r = refId == null ? null : mapper.selectLinkById(refId, user.getCompanyId());
        if (r == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "개별계약서를 찾을 수 없습니다.");
        }
        Map<String, String> mapping = new LinkedHashMap<>();
        mapping.put("계약회사명", str(r.contCorpName()));
        mapping.put("계약회사주소", str(r.address()));
        mapping.put("계약회사대표이사", str(r.ceo() + "       (인)"));   // AS-IS: getCeo() + "       (인)" — 대표이사가 비면 "null       (인)"
        mapping.put("펀드명", str(r.fundName()));
        mapping.put("보수율", str(r.fundFee()));
        mapping.put("계약일", date(r.contDate(), KOR_DATE));
        mapping.put("설정일", date(r.fundStartDate(), null));
        mapping.put("비고", str(r.note()));
        String title = r.contCorpName() + "(주) 일반사무관리 업무위탁 개별계약의 건";
        return Seed.of(title, formSupport.fill(user.getCompanyId(), "C01", mapping));
    }

    private static String date(LocalDate d, DateTimeFormatter f) {
        if (d == null) {
            return "- ";
        }
        return f == null ? d.toString() : d.format(f);
    }
}
