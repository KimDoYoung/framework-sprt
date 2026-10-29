package kr.co.kfs.asseterp.biz.car.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarInfoRes;
import kr.co.kfs.asseterp.biz.car.dto.CarInfoSaveReq;
import kr.co.kfs.asseterp.biz.car.mapper.CarInfoMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Car01_Tab_Info·Car01_Edit_Info(T10) → server/car/Car01_Info.java (selectByCompanyId L24 / update L69 / delete L74).
 * 저장·삭제는 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarInfoService {

    private final CarInfoMapper mapper;

    /** AS-IS selectByCompanyId — carType 기본 '%', searchText는 '%…%' */
    public List<CarInfoRes> search(UserPrincipal user, String carType, String searchText) {
        String type = carType == null || carType.isBlank() ? "%" : carType;
        return mapper.selectByCompanyId(user.getCompanyId(), type, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS Car01_Lookup_Info.retrieve — 차량 찾기 창. admin(openAdmin·openAll)이면 selectByCarTypeAdmin(그 구분 전부),
     * 아니면 selectByCarType(전용 1 = 내가 사용자인 차량, 그 밖 = 공용 2 = 내가 예약·등록한 차량)
     */
    public List<CarInfoRes> searchLookup(UserPrincipal user, String carType, String stdMonth, String searchText, boolean admin) {
        String text = "%" + (searchText == null || searchText.isBlank() ? "" : searchText) + "%";
        String type = carType == null || carType.isBlank() ? "%" : carType;
        if (admin) return mapper.selectByCarTypeAdmin(user.getCompanyId(), type, text);
        return "1".equals(type)
                ? mapper.selectByCarType1(user.getCompanyId(), user.getUserId(), type, stdMonth, text)
                : mapper.selectByCarType2(user.getCompanyId(), user.getUserId(), type, stdMonth, text);
    }

    /** AS-IS Car01_Edit_Info.update → 저장된 행. 차량구분·차량번호는 필수 */
    @Transactional
    public CarInfoRes save(UserPrincipal user, CarInfoSaveReq req) {
        if (req.carType() == null || req.carType().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "차량구분은 필수선택 항목입니다.");
        if (req.carNo() == null || req.carNo().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "차량번호는 필수입력 항목입니다.");
        Long companyId = user.getCompanyId();
        if (req.infoId() != null && req.infoId() > 0) {
            if (mapper.update(companyId, req) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            return mapper.selectById(companyId, req.infoId());
        }
        long id = mapper.selectNextId();
        mapper.insert(companyId, id, req);
        return mapper.selectById(companyId, id);
    }

    /** AS-IS Car01_Tab_Info.deleteCheck → delete: 예약(사용내역)이 있으면 지우지 않는다 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        for (Long id : ids) {
            if (mapper.countBookingsByInfoId(id) > 0) throw new BusinessException(ErrorCode.INVALID_INPUT, "사용내역이 등록된 차량정보는 삭제불가합니다");
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }
}
