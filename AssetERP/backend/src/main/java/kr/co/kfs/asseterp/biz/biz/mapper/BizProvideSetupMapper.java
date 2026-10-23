package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizProvideSetupRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideSetupSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BizProvideSetupMapper {

    /** AS-IS biz04_provide_setup.selectByProvidePurCode — providePurCode는 LIKE 패턴(목적 코드 + '%') */
    List<BizProvideSetupRes> selectByProvidePurCode(@Param("companyId") Long companyId, @Param("providePurCode") String providePurCode);

    /** AS-IS biz04_provide_setup.upsert — 같은 ID가 있으면 UPDATE, 없으면 새 ID로 INSERT */
    int upsert(@Param("companyId") Long companyId, @Param("req") BizProvideSetupSaveReq req);
}
