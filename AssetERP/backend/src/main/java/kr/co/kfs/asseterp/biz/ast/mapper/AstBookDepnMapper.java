package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.DepnBookGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.DepnBookRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetRes;
import kr.co.kfs.asseterp.biz.ast.dto.OfficeAssetTypeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/mapper/ast13_book_depn.xml (selectOfficeAssets · selectOfficeAssetsGroup · updateRetireDate) · sys00_common.selectOfficeAssets · sys99_print — 비품관리대장 W16 */
@Mapper
public interface AstBookDepnMapper {

    /** sys00_common.selectOfficeAssets — 구분 콤보(대분류 5x + 소모품_비품) */
    List<OfficeAssetTypeRes> selectOfficeAssetTypes();

    /** ast13_book_depn.selectOfficeAssets */
    List<OfficeAssetRes> selectOfficeAssets(@Param("companyId") Long companyId, @Param("depnDate") LocalDate depnDate,
                                            @Param("itemLClassCode") String itemLClassCode, @Param("retireYn") boolean retireYn,
                                            @Param("searchText") String searchText);

    /** ast13_book_depn.selectOfficeAssetsGroup */
    List<OfficeAssetGroupRes> selectOfficeAssetsGroup(@Param("companyId") Long companyId, @Param("depnDate") LocalDate depnDate);

    /** ast13_book_depn.updateRetireDate */
    int updateRetireDate(@Param("bookDepnId") Long bookDepnId, @Param("retireDate") LocalDate retireDate);

    long selectNextId();

    /** sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** sys99_print.insert — Sys99_Print.insertRdOfficeAssets가 채우는 열만 */
    int insertPrintOffice(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                          @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("b") OfficeAssetRes b);

    // ───── 감가상각대장 W17 (Ast13_Tab_DepnBook) ─────

    /** sys00_common.selectDepnItemType (kindCode ItemLClassCode, code 5%) */
    List<OfficeAssetTypeRes> selectDepnItemTypes();

    /** ast13_book_depn.selectByDepnDate2 */
    List<DepnBookRes> selectByDepnDate2(@Param("companyId") Long companyId, @Param("depnDate") LocalDate depnDate,
                                        @Param("itemLClassCode") String itemLClassCode, @Param("retireYn") boolean retireYn,
                                        @Param("searchText") String searchText);

    /** ast13_book_depn.getDepnDate2 */
    List<DepnBookGroupRes> selectDepnDate2Group(@Param("companyId") Long companyId, @Param("depnDate") LocalDate depnDate);

    /** sys99_print.insert — Sys99_Print.insertRdDepnBook이 채우는 열만 */
    int insertPrintDepn(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                        @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("b") DepnBookRes b);
}
