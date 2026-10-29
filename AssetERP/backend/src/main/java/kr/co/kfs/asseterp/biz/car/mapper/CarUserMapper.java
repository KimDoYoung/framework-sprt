package kr.co.kfs.asseterp.biz.car.mapper;

import kr.co.kfs.asseterp.biz.car.dto.CarUserRes;
import kr.co.kfs.asseterp.biz.car.dto.CarUserSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CarUserMapper {

    /** AS-IS car02_user.selectByInfoId */
    List<CarUserRes> selectByInfoId(@Param("infoId") Long infoId);

    /** AS-IS car02_user.selectById — 저장 결과 한 행 */
    CarUserRes selectById(@Param("userId") Long userId);

    long selectNextId();

    int insert(@Param("userId") Long userId, @Param("req") CarUserSaveReq req);

    int update(@Param("req") CarUserSaveReq req);

    int deleteByIds(@Param("ids") List<Long> ids);

    /** 차량정보가 로그인 회사 것인지 (car02_user에는 회사 컬럼이 없어 차량정보로 막는다) */
    int countInfoOfCompany(@Param("companyId") Long companyId, @Param("infoId") Long infoId);
}
