package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/** AS-IS server/apr/Apr01_Appr.java selectByPaging L1170 (selectByDcrWrite) — 문서작성 목록 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprService {

    private final AprApprMapper mapper;

    /** 등록/결재선/열람권한에 내가 든 문서. searchText·receiveName은 서비스가 %…%로 만든다(빈 글자면 %%). classTreeId가 없으면 분류 조건 없음 */
    public PageRes<AprDcrWriteRes> searchDcrWrite(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText,
                                                  String receiveName, Long classTreeId, long offset, long limit) {
        AprDcrWriteCond cond = new AprDcrWriteCond(user.getCompanyId(), user.getUserId(), startDate, closeDate, "%",
                like(searchText), like(receiveName), classTreeId, limit, offset);
        return new PageRes<>(mapper.selectByDcrWriteTotal(cond), mapper.selectByDcrWritePaging(cond));
    }

    private String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }
}
