package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapInitReq;
import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapRes;
import kr.co.kfs.asseterp.biz.act.dto.RealAccountMapSaveReq;
import kr.co.kfs.asseterp.biz.act.mapper.ActRealAccountMapMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/act/Act13_RealAccountMap.java (selectByCompanyId L25, insertInitData L55, update L73, delete L78) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActRealAccountMapService {

    private final ActRealAccountMapMapper mapper;

    /** AS-IS Act13_Tab_RealAccountMap.retrieve() L340-364: 로그인 회사, 검색어 "%검색어%"(없으면 "%") */
    public List<RealAccountMapRes> search(UserPrincipal user, String searchText) {
        String search = searchText == null || searchText.isEmpty() ? "%" : "%" + searchText + "%";
        return mapper.selectByCompanyId(user.getCompanyId(), search);
    }

    /**
     * AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하·없음)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로.
     * 화면 update() L374의 대표계정코드 필수 검사를 서버도 같은 문구로 한다
     */
    @Transactional
    public List<RealAccountMapRes> update(UserPrincipal user, List<RealAccountMapSaveReq> rows) {
        List<RealAccountMapRes> saved = new ArrayList<>();
        for (RealAccountMapSaveReq req : rows) {
            if (req.reprAccountCode() == null || req.reprAccountCode().isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "대표계정코드는 필수입력 항목입니다.");
            }
            boolean isNew = req.realAccountMapId() == null || req.realAccountMapId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.realAccountMapId();
            if (isNew) {
                mapper.insert(id, user.getCompanyId(), req);
            } else if (mapper.update(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /**
     * AS-IS insertInitData L55-71: 고른 (대표계정코드, 계정맵핑ID)마다 고른 고객사에서 같은 것을 지우고 관리자 회사 것을 복사한다 → 처리한 고객사 수.
     * 원본은 고객사마다 서비스를 따로 불러 하나라도 실패하면 일부만 복사됐다 — 여기서는 한 트랜잭션. 관리자 회사만(원본은 버튼 노출만 막았다)
     */
    @Transactional
    public int insertInitData(UserPrincipal user, RealAccountMapInitReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        List<Long> companyIds = req.companyIds() == null ? List.of() : req.companyIds();
        List<RealAccountMapInitReq.Item> items = req.items() == null ? List.of() : req.items();
        for (Long companyId : companyIds) {
            for (RealAccountMapInitReq.Item item : items) {
                mapper.deleteByAccountMap(companyId, item.reprAccountCode(), item.accountMap());
                mapper.insertInitData(companyId, item.reprAccountCode(), item.accountMap());
            }
        }
        return companyIds.size();
    }

    /** AS-IS Act13_RealAccountMap.getAccountName: 대표계정·매핑에 연결된 실계정 이름, 없으면 빈 글자(원본은 status 0 + 빈 메시지) */
    public String getAccountName(UserPrincipal user, String reprAccountCode, String accountMap) {
        String name = mapper.selectAccountName(user.getCompanyId(), reprAccountCode, accountMap);
        return name == null ? "" : name;
    }
}
