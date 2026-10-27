package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.AstCfBatchCreateReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfInfoRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfInfoSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstCfSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

/**
 * 현금흐름표 매퍼 (ast03_cf_info, ast04_cf)
 */
@Mapper
public interface AstCfInfoMapper {

    /** AS-IS ast03_cf_info.selectByClassTreeId */
    List<AstCfInfoRes> selectCfInfoList(@Param("astClassTreeId") Long astClassTreeId);

    /** AS-IS ast04_cf.selectByCfInfoId */
    List<AstCfRes> selectCfList(@Param("cfInfoId") Long cfInfoId);

    Long selectNextSeq();

    int insertCfInfo(@Param("cfInfoId") Long cfInfoId, @Param("req") AstCfInfoSaveReq req);

    int updateCfInfo(@Param("req") AstCfInfoSaveReq req);

    int deleteCfInfo(@Param("cfInfoId") Long cfInfoId);

    int insertCf(@Param("cfId") Long cfId, @Param("req") AstCfSaveReq req);

    int updateCf(@Param("req") AstCfSaveReq req);

    int deleteCf(@Param("cfId") Long cfId);

    int deleteCfByCfInfoId(@Param("cfInfoId") Long cfInfoId);

    /** AS-IS ast04_cf.lastDate */
    Date selectLastDate(@Param("date") Date date);

    /** AS-IS ast04_cf.bizDate */
    Date selectBizDate(@Param("companyId") Long companyId, @Param("string") String string, @Param("date") Date date);

    /** ast03_cf_info 일괄생성 설정 업데이트 */
    int updateBatchInfo(@Param("req") AstCfBatchCreateReq req);
}
