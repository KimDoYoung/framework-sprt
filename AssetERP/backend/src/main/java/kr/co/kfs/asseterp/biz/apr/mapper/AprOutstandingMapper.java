package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprOutstandingRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr01_appr.xml (selectOutstandingPopup) */
@Mapper
public interface AprOutstandingMapper {

    /** AS-IS apr01_appr.selectOutstandingPopup — 내(또는 대결 대상자) 차례인 미결재 문서 */
    List<AprOutstandingRes> selectOutstandingPopup(@Param("personId") Long personId);
}
