package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundTermsDetailRes;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndTermsDetailMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/fnd/Fnd26_TermsDetail.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndTermsDetailService {

    private final FndTermsDetailMapper mapper;

    /** AS-IS fnd.Fnd26_TermsDetail.selectByTermsId L37 (P07 규약 내용 조회창) */
    public List<FundTermsDetailRes> searchByTermsId(UserPrincipal user, Long termsId) {
        return mapper.selectByTermsId(termsId, user.getCompanyId());
    }
}
