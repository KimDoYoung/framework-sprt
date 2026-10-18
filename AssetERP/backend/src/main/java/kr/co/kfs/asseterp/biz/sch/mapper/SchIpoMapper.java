package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoExcelRow;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoSearchParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sch/mapper/sch10_ipo.xml + UpdateDataModel(sch10_ipo) — 공모주 일정 */
@Mapper
public interface SchIpoMapper {
    /** AS-IS selectBySearchTextAdmin (ManagerYn=true) */
    List<Sch10IpoRes> selectBySearchTextAdmin(@Param("p") Sch10IpoSearchParam p);

    Sch10IpoRes selectById(@Param("ipoId") Long ipoId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insertIpo(@Param("ipoId") Long ipoId, @Param("companyId") Long companyId, @Param("req") Sch10IpoSaveReq req);

    int updateIpo(@Param("companyId") Long companyId, @Param("req") Sch10IpoSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteIpos(@Param("companyId") Long companyId, @Param("ipoIds") List<Long> ipoIds);

    /** AS-IS excelInsert: 시장구분·종목명이 같은 행이 있으면 UPDATE, 없으면 INSERT */
    int excelInsert(@Param("row") Sch10IpoExcelRow row);
}
