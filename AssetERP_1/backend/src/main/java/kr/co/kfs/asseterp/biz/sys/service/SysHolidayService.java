package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.HolidayInitReq;
import kr.co.kfs.asseterp.biz.sys.dto.HolidayRes;
import kr.co.kfs.asseterp.biz.sys.dto.HolidaySaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysHolidayMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys14_Holiday.java (selectByYear L29 / insertInitData L54 / update L70 / delete L75) — 휴일은 로그인 회사 것, 기초데이터생성만 관리자 회사 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysHolidayService {

    private final SysHolidayMapper mapper;

    /** AS-IS selectByYear: year는 화면의 조회연도 그대로(LIKE) — 비어 있으면 결과가 없다(원본 동작) */
    public List<HolidayRes> search(UserPrincipal user, String year) {
        return mapper.selectByYear(user.getCompanyId(), year == null || year.isEmpty() ? null : year);
    }

    /** AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하)면 INSERT(회사 = 로그인 회사), 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<HolidayRes> update(UserPrincipal user, List<HolidaySaveReq> rows) {
        List<HolidayRes> saved = new ArrayList<>();
        for (HolidaySaveReq req : rows) {
            boolean isNew = req.holidayId() == null || req.holidayId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.holidayId();
            if (isNew) {
                mapper.insertHoliday(id, user.getCompanyId(), req);
            } else if (mapper.updateHoliday(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다(05 §6) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteHolidays(user.getCompanyId(), ids);
    }

    /** AS-IS insertInitData: 고른 일자마다 그 회사의 같은 날 휴일을 지우고 admin(회사 0)의 휴일을 복사 → 처리한 일자 수. 관리자 회사만 */
    @Transactional
    public int insertInitData(UserPrincipal user, HolidayInitReq req) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        if (req.companyId() == null) {
            // AS-IS: 고객사를 안 골라도 companyId가 null인 채로 실행돼 회사 없는 행이 생긴다 — 원인이 분명해 미리 막는다
            throw new BusinessException(ErrorCode.INVALID_INPUT, "고객사를 선택해주세요");
        }
        List<String> days = req.days() == null ? List.of() : req.days();
        for (String day : days) {
            mapper.deleteByDay(req.companyId(), day);
            mapper.insertInitData(req.companyId(), day);
        }
        return days.size();
    }
}
