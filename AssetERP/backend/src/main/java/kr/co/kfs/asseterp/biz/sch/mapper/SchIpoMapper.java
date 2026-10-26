package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoExcelRow;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoSearchParam;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoUserCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoUserRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch11IpoCompanyRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch11IpoCompanySaveReq;
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

    // ===== 공모주 일정조회 (Q04, Sch10_Tab_Ipo) =====

    /** AS-IS selectBySearchText (ManagerYn=false) */
    List<Sch10IpoUserRes> selectBySearchText(@Param("c") Sch10IpoUserCond c);

    /** AS-IS sch11_ipo_company.insertInterest (UPDATE 없으면 INSERT) */
    int insertInterest(@Param("companyId") Long companyId, @Param("ipoId") Long ipoId, @Param("interestYn") Boolean interestYn);

    /** AS-IS sch02_share.selectByInfoId3 */
    List<Sch02ShareRes> selectSharesByIpoId(@Param("companyId") Long companyId, @Param("ipoId") Long ipoId);

    /** AS-IS sch02_share.selectShareInto (일정공유 문구) */
    String selectShareInfo(@Param("companyId") Long companyId, @Param("ipoId") Long ipoId);

    /** AS-IS sch11_ipo_company.selectByIpoId */
    Sch11IpoCompanyRes selectCompanyByIpoId(@Param("companyId") Long companyId, @Param("ipoId") Long ipoId);

    Sch11IpoCompanyRes selectCompanyById(@Param("companyId") Long companyId, @Param("ipoCompanyId") Long ipoCompanyId);

    int insertCompany(@Param("ipoCompanyId") Long ipoCompanyId, @Param("companyId") Long companyId, @Param("ipoId") Long ipoId,
                      @Param("req") Sch11IpoCompanySaveReq req);

    int updateCompany(@Param("companyId") Long companyId, @Param("ipoId") Long ipoId, @Param("req") Sch11IpoCompanySaveReq req);

    /** AS-IS sys99_print.deleteByPersonId (insertRdIpo ① 내 출력 자료 지움) */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdIpo ② 한 행 담기 */
    int insertPrint(@Param("printId") Long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId, @Param("row") Sch10IpoUserRes row);
}
