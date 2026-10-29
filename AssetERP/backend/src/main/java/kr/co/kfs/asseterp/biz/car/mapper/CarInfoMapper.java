package kr.co.kfs.asseterp.biz.car.mapper;

import kr.co.kfs.asseterp.biz.car.dto.CarInfoRes;
import kr.co.kfs.asseterp.biz.car.dto.CarInfoSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CarInfoMapper {

    /** AS-IS car01_info.selectByCompanyId */
    List<CarInfoRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("carType") String carType, @Param("searchText") String searchText);

    /** 저장 결과 한 행 (selectByCompanyId와 같은 열, 로그인 회사 행만) */
    CarInfoRes selectById(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    long selectNextId();

    int insert(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("req") CarInfoSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") CarInfoSaveReq req);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS car01_info.selectByCarType1 — 전용차량(1) 중 내가 stdMonth('YYYY.MM')에 사용자인 차량 */
    List<CarInfoRes> selectByCarType1(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("carType") String carType,
                                      @Param("stdMonth") String stdMonth, @Param("searchText") String searchText);

    /** AS-IS car01_info.selectByCarType2 — 공용차량(2) 중 내가 stdMonth('YYYY.MM')에 예약했거나 등록한 차량 */
    List<CarInfoRes> selectByCarType2(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("carType") String carType,
                                      @Param("stdMonth") String stdMonth, @Param("searchText") String searchText);

    /** AS-IS car01_info.selectByCarTypeAdmin — 사용자 조건 없이 그 구분의 차량 전부 */
    List<CarInfoRes> selectByCarTypeAdmin(@Param("companyId") Long companyId, @Param("carType") String carType, @Param("searchText") String searchText);

    /** AS-IS car03_booking.selectByInfoId 행 수 (삭제 전 사용내역 확인) */
    int countBookingsByInfoId(@Param("infoId") Long infoId);
}
