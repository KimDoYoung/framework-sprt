package kr.co.kfs.asseterp.biz.pay.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayItemSaveReq;
import kr.co.kfs.asseterp.biz.pay.mapper.PayItemMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/pay/Pay20_Item.java (selectByText L24 / selectBySearchText L30 / update L53 / delete L58).
 * 급여항목은 회사와 무관한 공통 표라 저장·삭제는 관리자 회사만 한다(보안 보강, E21과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayItemService {

    private final PayItemMapper mapper;

    /** AS-IS selectBySearchText: 항목구분은 코드(전체면 "%"), 항목명은 "%검색어%" */
    public List<PayItemRes> search(String itemType, String searchText) {
        return mapper.selectBySearchText(itemType == null || itemType.isEmpty() ? "%" : itemType, "%" + nvl(searchText) + "%");
    }

    /** AS-IS selectByText(급여항목 조회창): 항목명 "%검색어%" */
    public List<PayItemRes> lookup(String searchText) {
        return mapper.selectByText("%" + nvl(searchText) + "%");
    }

    /**
     * AS-IS update(UpdateDataModel): 있는 행은 고치고, 없는 행은 새 id로 넣는다 → 저장된 행(요청 순서).
     * 원본은 필수값 검사가 없어 NOT NULL 열이 비면 DB 오류가 나므로 서버가 먼저 막는다
     */
    @Transactional
    public List<PayItemRes> save(UserPrincipal user, List<PayItemSaveReq> rows) {
        requireSysAdmin(user);
        for (PayItemSaveReq req : rows) {
            if (isBlank(req.itemType())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "항목구분은 필수입력 항목입니다.");
            }
            if (isBlank(req.itemCd())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "코드는 필수입력 항목입니다.");
            }
            if (isBlank(req.itemName())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "항목명은 필수입력 항목입니다.");
            }
        }
        return rows.stream().map(req -> {
            boolean exists = req.itemId() != null && req.itemId() > 0 && mapper.selectById(req.itemId()) != null;
            if (exists) {
                mapper.update(req);
                return mapper.selectById(req.itemId());
            }
            long newId = mapper.selectNextId();
            mapper.insert(newId, req);
            return mapper.selectById(newId);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteByIds(ids);
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
