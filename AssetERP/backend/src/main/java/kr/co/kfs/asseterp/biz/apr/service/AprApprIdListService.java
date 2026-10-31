package kr.co.kfs.asseterp.biz.apr.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprIdRowRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprIdListMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;

/** 결재문서 번호 목록으로 문서 읽기 (AS-IS apr.Apr01_Appr.selectByApprIdList, Apr01_Lookup_ApprLink) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprIdListService {

    private final AprApprIdListMapper mapper;

    public List<AprApprIdRowRes> byIds(UserPrincipal user, List<Long> apprIds) {
        if (apprIds == null || apprIds.isEmpty()) {
            return List.of();
        }
        return mapper.selectByApprIdList(user.getCompanyId(), apprIds);
    }
}
