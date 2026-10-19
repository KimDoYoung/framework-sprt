package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalListRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprDisposalListMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/apr/Apr90_DisposalList.java selectByPersonId L43 (Apr90_Tab_DisposalList) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprDisposalListService {

    private final AprDisposalListMapper mapper;

    /** 로그인 사용자가 신청한 폐기문서 (신청일 기간). personId는 서버가 세션에서(원본 LoginUser.getUserId()) */
    public List<AprDisposalListRes> searchByPerson(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectByPersonId(new AprDisposalListCond(user.getUserId(), startDate, closeDate));
    }
}
