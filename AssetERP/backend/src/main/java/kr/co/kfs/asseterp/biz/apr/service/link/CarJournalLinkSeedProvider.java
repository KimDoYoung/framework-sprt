package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.mapper.CarJournalApprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A16 차량 운행일지 (Apr01_Edit_ApprDoc.insertLinkApproval L1967-1975, 호출 Car04_Tab_Journal).
 * 제목 `차량 운행일지`(수정 가능), 본문은 정하지 않아(`linkHtmlContent` 없음) 문서분류의 대표 양식을 쓴다. 운행일지 PDF는 상신 행의 첨부로 이미 올라가 있고 저장 때 문서에 붙는다(`appr-id` API).
 * refId = 상신 행 번호(car05_relate_appr_id, 호출 화면이 `linkModel.setJournalId(relateApprId)`로 넘긴 값).
 */
@Component
@RequiredArgsConstructor
public class CarJournalLinkSeedProvider implements AprLinkSeedProvider {

    private final CarJournalApprMapper mapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A16");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        if (refId == null || mapper.countRelateAppr(refId, user.getCompanyId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "차량 운행일지 상신 내역을 찾을 수 없습니다.");
        }
        return new Seed("차량 운행일지", null, null, false, false);
    }
}
