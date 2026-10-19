package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOftenUseRes;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrOftenUseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/dcr/Dcr08_OftenUse.java selectByPersonId L24 — 최근 사용한 문서분류 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrOftenUseService {

    private final DcrOftenUseMapper mapper;

    /** 로그인 사용자의 목록 (personId는 서버가 세션에서 꺼낸다) */
    public List<DcrOftenUseRes> search(UserPrincipal user) {
        return mapper.selectByPersonId(user.getUserId());
    }
}
