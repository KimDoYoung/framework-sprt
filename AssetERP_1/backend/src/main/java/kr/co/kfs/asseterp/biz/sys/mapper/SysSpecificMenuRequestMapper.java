package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRequestRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRequestSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys53_specific_menu_request.xml (selectByText, selectById) + UpdateDataModel(sys53_specific_menu_request) */
@Mapper
public interface SysSpecificMenuRequestMapper {
    List<SpecificMenuRequestRes> selectByText(@Param("companyId") Long companyId, @Param("stateCd") String stateCd,
                                              @Param("specificWorkCd") String specificWorkCd);

    SpecificMenuRequestRes selectById(@Param("specificMenuRequestId") Long specificMenuRequestId);

    /** 등록 버튼의 새 행 기본값 (신청자 = 조직 + 성명, 신청일 = 오늘) */
    SpecificMenuRequestRes selectNewRow(@Param("userId") Long userId);

    Long selectNextId();

    int insertSpecificMenuRequest(@Param("specificMenuRequestId") Long specificMenuRequestId, @Param("companyId") Long companyId,
                                  @Param("personId") Long personId, @Param("req") SpecificMenuRequestSaveReq req);

    int updateSpecificMenuRequest(@Param("companyId") Long companyId, @Param("req") SpecificMenuRequestSaveReq req);

    int deleteSpecificMenuRequests(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
