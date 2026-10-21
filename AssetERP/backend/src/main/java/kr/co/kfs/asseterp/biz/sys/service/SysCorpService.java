package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CorpRes;
import kr.co.kfs.asseterp.biz.sys.dto.CorpSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCorpMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys15_Corp.java (selectByCompanyId L25 / insertInitData L40 / update L45 / delete L128) — 거래처는 로그인 회사 것만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCorpService {

    private final SysCorpMapper mapper;

    /** AS-IS selectByCompanyId: corpType은 화면 콤보 코드('%'면 전체), 검색어는 클라이언트가 "%"+값+"%"로 보냈다 → 서버가 만든다 */
    public List<CorpRes> search(UserPrincipal user, String corpType, String searchText, boolean useYn) {
        String type = corpType == null || corpType.isEmpty() ? "%" : corpType;
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByCompanyId(user.getCompanyId(), type, text, useYn);
    }

    /** AS-IS selectByUseYn(거래처 조회창, empYn=false): 구분 콤보 코드('%'면 전체), 검색어는 "%"+값+"%" (거래처명·기관코드·비고) */
    public List<CorpRes> lookup(UserPrincipal user, String corpType, String searchText) {
        String type = corpType == null || corpType.isEmpty() ? "%" : corpType;
        String text = searchText == null || searchText.isEmpty() ? "%" : "%" + searchText + "%";
        return mapper.selectLookup(user.getCompanyId(), type, text);
    }

    /** AS-IS update L45-126: 필수·자릿수·중복 검사 → 있으면 UPDATE, 없으면 INSERT → 저장된 행(요청 순서) */
    @Transactional
    public List<CorpRes> update(UserPrincipal user, List<CorpSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<CorpRes> saved = new ArrayList<>();
        for (CorpSaveReq in : rows) {
            CorpSaveReq req = in;
            if (isBlank(req.corpType())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "거래처구분을 선택해주세요.");
            }
            if (isBlank(req.corpName())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "거래처명을 입력해주세요.");
            }

            String bizNo = null;
            String bizNoFormat = req.bizNo();
            if (!isBlank(req.bizNo())) {
                bizNo = req.bizNo().replace("-", "");
                if (bizNo.length() != 10) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "사업자번호는 10자리('-'제외) 입니다. 확인해주세요.");
                }
                bizNoFormat = bizNo.substring(0, 3) + "-" + bizNo.substring(3, 5) + "-" + bizNo.substring(5);
            }

            boolean isNew = req.corpId() == null || req.corpId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.corpId();
            req = req.withId(id);
            if (!isNew) {
                // 남의 회사 거래처는 고칠 수 없다 (AS-IS는 화면이 로그인 회사 행만 보여 준다)
                CorpRes exist = mapper.selectById(id);
                if (exist != null && !companyId.equals(exist.companyId())) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED);
                }
            }

            String corpCode = req.corpCode();
            if (!isBlank(corpCode)) {
                if (corpCode.length() > 12) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "거래처코드는 최대 12자리까지 입력해주세요.");
                }
                if (mapper.selectCorpCodeCheck(companyId, corpCode, id) > 0) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "동일 거래처코드가 존재합니다. (" + corpCode + ")");
                }
            } else if (!isBlank(bizNo)) {
                corpCode = mapper.selectNewCorpCodeByBizNo(companyId, bizNo);
            }

            if (req.issCorpCode() != null && req.issCorpCode().length() > 5) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "발행기관코드는 최대 5자리까지 입력해주세요.");
            }

            req = req.withBizNoAndCode(bizNoFormat, corpCode);
            if (mapper.selectById(id) == null) {
                mapper.insertCorp(companyId, req);
            } else {
                mapper.updateCorp(companyId, req);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete L128-143: 다른 테이블이 쓰는 거래처가 하나라도 있으면 아무것도 지우지 않는다 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        Long companyId = user.getCompanyId();
        for (Long id : ids) {
            if (mapper.checkUseCorpId(id) != 0) {
                CorpRes corp = mapper.selectById(id);
                throw new BusinessException(ErrorCode.INVALID_INPUT,
                        "사용중인 기관으로 삭제할 수 없습니다. (" + (corp == null ? "" : corp.corpName()) + ")");
            }
        }
        return mapper.deleteCorps(companyId, ids);
    }

    /** AS-IS insertInitData: 관리자(회사 0)의 거래처를 고른 회사로 복사. 화면 버튼은 관리자 회사만 보인다 */
    @Transactional
    public int insertInitData(UserPrincipal user, Long companyId) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        if (companyId == null) {
            // AS-IS: 고객사를 안 골라도 companyId가 null인 채로 실행돼 DB 오류가 난다 — 원인이 분명해 미리 막는다 (A18과 같은 처리)
            throw new BusinessException(ErrorCode.INVALID_INPUT, "고객사를 선택해주세요");
        }
        return mapper.insertInitData(companyId);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }
}
